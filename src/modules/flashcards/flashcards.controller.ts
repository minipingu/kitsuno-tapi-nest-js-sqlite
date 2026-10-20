import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { FlashcardsService } from './flashcards.service';
import { KanjiService } from '../characters/kanji.service';
import { SessionOrApiKeyGuard } from '../auth/guards/session-or-api-key.guard';
import { FlashcardDto } from './dto/flashcard.dto';
import { FlashcardResponseDto } from './dto/flashcard-response.dto';
import { Request, Response } from 'express';
import { User } from '../../entities/user.entity';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { spawn } from 'child_process';

@ApiTags('Flashcards')
@UseGuards(SessionOrApiKeyGuard)
@Controller('api')
export class FlashcardsController {
  constructor(
    private readonly flashcardsService: FlashcardsService,
    private readonly kanjiService: KanjiService,
  ) { }

  @Get('flashcards')
  @ApiOperation({ summary: 'Get all flashcards for authenticated user' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved flashcards', type: [FlashcardResponseDto] })
  async getAllFlashcardsForUser(@Req() req: Request): Promise<FlashcardResponseDto[]> {
    const user = req.user as User;
    const flashcards = await this.flashcardsService.getAllFlashcardsByUserId(user.id);
    return flashcards.map((f) => this.flashcardsService.toDto(f));
  }

  @Get('flashcards/by-kanji/:character')
  @ApiOperation({ summary: 'Get flashcard by kanji character for current user' })
  async getFlashcardByKanji(
    @Req() req: Request,
    @Param('character') character: string,
  ): Promise<FlashcardResponseDto | null> {
    const user = req.user as User;
    const flashcard = await this.flashcardsService.getFlashcardByUserAndKanji(
      user.id,
      character,
    );
    if (!flashcard) {
      return null;
    }
    return this.flashcardsService.toDto(flashcard);
  }

  @Get('flashcards/:flashcardId')
  @ApiOperation({ summary: 'Get a flashcard by ID' })
  @ApiParam({ name: 'flashcardId', description: 'ID of the flashcard' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved flashcard', type: FlashcardResponseDto })
  async getFlashcardByUserAndId(
    @Req() req: Request,
    @Param('flashcardId', ParseIntPipe) flashcardId: number,
  ): Promise<FlashcardResponseDto> {
    const user = req.user as User;
    const flashcard = await this.flashcardsService.getFlashcardByUserAndId(
      user.id,
      flashcardId,
    );
    return this.flashcardsService.toDto(flashcard);
  }

  @Post('flashcards')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create or update a flashcard' })
  async createOrUpdateFlashcard(
    @Req() req: Request,
    @Body() flashcardDto: FlashcardDto,
  ): Promise<FlashcardResponseDto> {
    const user = req.user as User;
    if (!flashcardDto.hasAtLeastOneVocabPair()) {
      throw new BadRequestException(
        'Flashcard must have at least one vocabulary word and meaning pair.',
      );
    }

    const kanji = await this.kanjiService.findKanjiById(flashcardDto.kanjiId);
    const saved = await this.flashcardsService.saveOrUpdateFlashcard(
      flashcardDto,
      user.id,
      kanji.character,
    );
    return this.flashcardsService.toDto(saved);
  }

  @Put('flashcards/:flashcardId')
  @ApiOperation({ summary: 'Update a flashcard by ID' })
  async updateFlashcard(
    @Req() req: Request,
    @Param('flashcardId', ParseIntPipe) flashcardId: number,
    @Body() flashcardDto: FlashcardDto,
  ): Promise<FlashcardResponseDto> {
    const user = req.user as User;
    const existing = await this.flashcardsService.getFlashcardByUserAndId(
      user.id,
      flashcardId,
    );

    if (!flashcardDto.hasAtLeastOneVocabPair()) {
      throw new BadRequestException(
        'Flashcard must have at least one vocabulary word and meaning pair.',
      );
    }

    flashcardDto.kanjiId = existing.kanji.id;
    const saved = await this.flashcardsService.saveOrUpdateFlashcard(
      flashcardDto,
      user.id,
      existing.kanji.character,
    );
    return this.flashcardsService.toDto(saved);
  }

  @Delete('flashcards/:flashcardId')
  @ApiOperation({ summary: 'Delete a flashcard' })
  async deleteFlashcard(
    @Req() req: Request,
    @Param('flashcardId', ParseIntPipe) flashcardId: number,
  ): Promise<{ success: boolean; message: string }> {
    const user = req.user as User;
    const flashcard = await this.flashcardsService.getFlashcardByUserAndId(
      user.id,
      flashcardId,
    );
    await this.flashcardsService.deleteFlashcard(flashcard.id);
    return { success: true, message: 'Flashcard deleted successfully' };
  }

  @Get(['flashcards/export/csv', 'flashcards/export_flashcards_csv'])
  @Post(['flashcards/export/csv', 'flashcards/export_flashcards_csv'])
  @ApiOperation({ summary: 'Export flashcards as CSV file' })
  async exportCsv(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const flashcards = await this.flashcardsService.getAllFlashcardsByUserId(user.id);

    res.setHeader('Content-Type', 'text/csv; charset=UTF-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${user.username || 'user'}_flashcards.csv"`,
    );

    let csv = '\uFEFF';
    csv += 'Kanji,Kunyomi,Onyomi,Meaning,Notes,Vocabulary\n';

    for (const fc of flashcards) {
      const kanji = fc.kanji?.character || '';
      const kunyomi = fc.kanji?.kunyomiReadings?.length
        ? fc.kanji.kunyomiReadings.join(', ')
        : '-';
      const onyomi = fc.kanji?.onyomiReadings?.length
        ? fc.kanji.onyomiReadings.join(', ')
        : '-';
      const meanings = fc.kanji?.meanings || '';
      const notes = fc.notes || '-';
      const vocabulary = fc.vocabulary?.length ? fc.vocabulary.join('; ') : '';

      const escape = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;
      csv += `${escape(kanji)},${escape(kunyomi)},${escape(onyomi)},${escape(meanings)},${escape(notes)},${escape(vocabulary)}\n`;
    }

    return res.send(csv);
  }

  @Get(['flashcards/export/json', 'flashcards/export_flashcards_json'])
  @Post(['flashcards/export/json', 'flashcards/export_flashcards_json'])
  @ApiOperation({ summary: 'Export flashcards as JSON file' })
  async exportJson(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const flashcards = await this.flashcardsService.getAllFlashcardsByUserId(user.id);

    const jsonData = flashcards.map((fc) => ({
      kanji: fc.kanji?.character || '',
      kunyomi: fc.kanji?.kunyomiReadings?.length
        ? fc.kanji.kunyomiReadings.join(', ')
        : '-',
      onyomi: fc.kanji?.onyomiReadings?.length
        ? fc.kanji.onyomiReadings.join(', ')
        : '-',
      meaning: fc.kanji?.meanings || '',
      notes: fc.notes || '-',
      vocabulary: fc.vocabulary?.length ? fc.vocabulary.join('; ') : '',
    }));

    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${user.username || 'user'}_flashcards.json"`,
    );

    return res.json(jsonData);
  }

  @Get(['flashcards/export/anki', 'flashcards/export_flashcards_anki'])
  @Post(['flashcards/export/anki', 'flashcards/export_flashcards_anki'])
  @ApiOperation({ summary: 'Export flashcards as Anki (.apkg) file' })
  async exportAnki(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const flashcards = await this.flashcardsService.getAllFlashcardsByUserId(user.id);

    const flashcardsData = flashcards.map((fc) => [
      fc.kanji?.character || '',
      fc.notes || '',
      fc.kanji?.kunyomiReadings?.length ? fc.kanji.kunyomiReadings.join(', ') : '',
      fc.kanji?.onyomiReadings?.length ? fc.kanji.onyomiReadings.join(', ') : '',
      fc.kanji?.meanings || '',
      fc.vocabulary?.length ? fc.vocabulary.join(', ') : '',
    ]);

    const tempJsonPath = path.join(os.tmpdir(), `flashcards_${Date.now()}.json`);
    fs.writeFileSync(tempJsonPath, JSON.stringify(flashcardsData), 'utf-8');

    const pythonScriptPath = path.join(
      process.cwd(),
      'public',
      'python',
      'flashcards_to_anki.py',
    );

    try {
      const pyProcess = spawn('python', [pythonScriptPath, tempJsonPath]);
      const chunks: Buffer[] = [];
      let errStr = '';

      pyProcess.stdout.on('data', (chunk) => chunks.push(chunk));
      pyProcess.stderr.on('data', (data) => (errStr += data.toString()));

      pyProcess.on('close', (code) => {
        fs.unlink(tempJsonPath, () => { });

        if (code === 0 && chunks.length > 0) {
          const buffer = Buffer.concat(chunks);
          res.setHeader('Content-Type', 'application/octet-stream');
          res.setHeader(
            'Content-Disposition',
            `attachment; filename="${user.username || 'user'}_flashcards.apkg"`,
          );
          return res.send(buffer);
        } else {
          console.warn(
            'Python / genanki execution failed or Python not installed:',
            errStr,
          );
          res.setHeader('Content-Type', 'application/json; charset=UTF-8');
          res.setHeader(
            'Content-Disposition',
            `attachment; filename="${user.username || 'user'}_flashcards_for_anki.json"`,
          );
          return res.json({
            notice:
              'Python genanki package required for direct .apkg generation. Flashcard data provided below.',
            data: flashcardsData,
          });
        }
      });
    } catch (err: any) {
      fs.unlink(tempJsonPath, () => { });
      return res.status(500).send('Anki export error: ' + err.message);
    }
  }
}
