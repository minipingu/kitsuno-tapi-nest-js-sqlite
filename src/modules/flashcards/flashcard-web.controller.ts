import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  Res,
  Render,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FlashcardsService } from './flashcards.service';
import { KanjiService } from '../characters/kanji.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { FlashcardDto } from './dto/flashcard.dto';
import { User } from '../../entities/user.entity';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { spawn } from 'child_process';

@Controller()
export class FlashcardWebController {
  constructor(
    private readonly flashcardsService: FlashcardsService,
    private readonly kanjiService: KanjiService,
  ) {}

  @Get('flashcards')
  @UseGuards(AuthenticatedGuard)
  @Render('flashcard')
  async showFlashcards(@Req() req: Request) {
    const user = req.user as User;
    const flashcardsList = await this.flashcardsService.getAllFlashcardsByUserId(user.id);

    return {
      isAuthenticated: true,
      username: user.username,
      flashcardsList,
    };
  }

  @Post('kanji/:character')
  @UseGuards(AuthenticatedGuard)
  async saveOrUpdateFlashcard(
    @Param('character') character: string,
    @Body() flashcardDto: FlashcardDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user as User;

    if (!flashcardDto.hasAtLeastOneVocabPair()) {
      const kanji = await this.kanjiService.findKanjiByCharacter(character);
      const existing = await this.flashcardsService.getFlashcardByUserAndKanji(
        user.id,
        character,
      );

      return res.render('kanji-details', {
        isAuthenticated: true,
        username: user.username,
        kanji,
        userId: user.id,
        hasFlashcard: !!existing,
        hasError: true,
        errorMessage: 'At least one vocabulary pair is required',
        flashcardDTO: flashcardDto,
      });
    }

    if (!flashcardDto.kanjiId) {
      const kanji = await this.kanjiService.findKanjiByCharacter(character);
      flashcardDto.kanjiId = kanji.id;
    }

    await this.flashcardsService.saveOrUpdateFlashcard(
      flashcardDto,
      user.id,
      character,
    );

    return res.redirect('/flashcards');
  }

  @Post('flashcards/delete/:id')
  @UseGuards(AuthenticatedGuard)
  async deleteFlashcard(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    await this.flashcardsService.deleteFlashcard(id);
    return res.redirect('/flashcards');
  }

  @Post('flashcards/export_flashcards_csv')
  @UseGuards(AuthenticatedGuard)
  async exportCsv(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const flashcards = await this.flashcardsService.getAllFlashcardsByUserId(user.id);

    res.setHeader('Content-Type', 'text/csv; charset=UTF-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${user.username}_flashcards.csv"`,
    );

    // Write UTF-8 BOM
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

  @Post('flashcards/export_flashcards_json')
  @UseGuards(AuthenticatedGuard)
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
      `attachment; filename="${user.username}_flashcards.json"`,
    );

    return res.json(jsonData);
  }

  @Post('flashcards/export_flashcards_anki')
  @UseGuards(AuthenticatedGuard)
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
      // Execute python script
      const pyProcess = spawn('python', [pythonScriptPath, tempJsonPath]);
      const chunks: Buffer[] = [];
      let errStr = '';

      pyProcess.stdout.on('data', (chunk) => chunks.push(chunk));
      pyProcess.stderr.on('data', (data) => (errStr += data.toString()));

      pyProcess.on('close', (code) => {
        fs.unlink(tempJsonPath, () => {});

        if (code === 0 && chunks.length > 0) {
          const buffer = Buffer.concat(chunks);
          res.setHeader('Content-Type', 'application/octet-stream');
          res.setHeader(
            'Content-Disposition',
            `attachment; filename="${user.username}_flashcards.apkg"`,
          );
          return res.send(buffer);
        } else {
          // Fallback if Python or genanki is not installed on system: export JSON format with notice
          console.warn(
            'Python / genanki execution failed or Python not installed:',
            errStr,
          );
          res.setHeader('Content-Type', 'application/json; charset=UTF-8');
          res.setHeader(
            'Content-Disposition',
            `attachment; filename="${user.username}_flashcards_for_anki.json"`,
          );
          return res.json({
            notice:
              'Python genanki package required for direct .apkg generation. Flashcard data provided below.',
            data: flashcardsData,
          });
        }
      });
    } catch (err) {
      fs.unlink(tempJsonPath, () => {});
      return res.status(500).send('Anki export error: ' + err.message);
    }
  }
}
