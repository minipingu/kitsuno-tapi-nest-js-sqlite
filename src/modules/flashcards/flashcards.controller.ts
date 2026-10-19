import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiParam,
} from '@nestjs/swagger';
import { FlashcardsService } from './flashcards.service';
import { KanjiService } from '../characters/kanji.service';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { FlashcardDto } from './dto/flashcard.dto';
import { FlashcardResponseDto } from './dto/flashcard-response.dto';
import { Request } from 'express';
import { User } from '../../entities/user.entity';

@ApiTags('Flashcards')
@ApiHeader({
  name: 'API-KEY',
  description: 'Your Kitsuno API key',
  required: true,
})
@UseGuards(ApiKeyGuard)
@Controller('api')
export class FlashcardsController {
  constructor(
    private readonly flashcardsService: FlashcardsService,
    private readonly kanjiService: KanjiService,
  ) {}

  @Get('flashcards')
  @ApiOperation({
    summary: 'Get all flashcards',
    description: 'Retrieve all flashcards associated with the user linked to the provided API key.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved flashcards', type: [FlashcardResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized - API key is missing or invalid' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllFlashcardsForUser(@Req() req: Request): Promise<FlashcardResponseDto[]> {
    const user = req.user as User;
    const flashcards = await this.flashcardsService.getAllFlashcardsByUserId(user.id);
    return flashcards.map((f) => this.flashcardsService.toDto(f));
  }

  @Get('flashcards/:flashcardId')
  @ApiOperation({
    summary: 'Get a flashcard by ID',
    description: 'Retrieve a flashcard by its ID, ensuring it belongs to the user associated with the provided API key.',
  })
  @ApiParam({ name: 'flashcardId', description: 'ID of the flashcard' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved flashcard', type: FlashcardResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - API key is missing or invalid' })
  @ApiResponse({ status: 404, description: 'Flashcard not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getFlashcardByUserAndId(
    @Req() req: Request,
    @Param('flashcardId', ParseIntPipe) flashcardId: number,
  ): Promise<FlashcardResponseDto> {
    const user = req.user as User;
    const flashcard = await this.flashcardsService.getFlashcardByUserAndId(user.id, flashcardId);
    return this.flashcardsService.toDto(flashcard);
  }

  @Post('flashcards')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new flashcard',
    description: 'Create a new flashcard for the user linked to the provided API key. At least one vocabulary word-meaning pair must be provided.',
  })
  @ApiResponse({ status: 201, description: 'Successfully created flashcard' })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  @ApiResponse({ status: 401, description: 'Unauthorized - API key is missing or invalid' })
  @ApiResponse({ status: 409, description: 'Flashcard already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createFlashcard(
    @Req() req: Request,
    @Body() flashcardDto: FlashcardDto,
  ): Promise<void> {
    const user = req.user as User;
    if (!flashcardDto.kanjiId) {
      throw new BadRequestException('Kanji ID cannot be null.');
    }

    const kanji = await this.kanjiService.findKanjiById(flashcardDto.kanjiId);
    const existing = await this.flashcardsService.getFlashcardByUserAndKanji(
      user.id,
      kanji.character,
    );
    if (existing) {
      throw new ConflictException(
        `Flashcard with kanji character ${kanji.character} already exists for the current user. Try to update it instead.`,
      );
    }

    if (!flashcardDto.hasAtLeastOneVocabPair()) {
      throw new BadRequestException(
        'Flashcard must have at least one vocabulary word and meaning pair.',
      );
    }

    await this.flashcardsService.saveOrUpdateFlashcard(
      flashcardDto,
      user.id,
      kanji.character,
    );
  }

  @Put('flashcards/:flashcardId')
  @ApiOperation({
    summary: 'Update a flashcard',
    description: 'Update an existing flashcard by its ID, ensuring it belongs to the user linked to the provided API key. At least one vocabulary word-meaning pair must be provided.',
  })
  @ApiParam({ name: 'flashcardId', description: 'ID of the flashcard' })
  @ApiResponse({ status: 200, description: 'Successfully updated flashcard' })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  @ApiResponse({ status: 401, description: 'Unauthorized - API key is missing or invalid' })
  @ApiResponse({ status: 404, description: 'Flashcard not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateFlashcard(
    @Req() req: Request,
    @Param('flashcardId', ParseIntPipe) flashcardId: number,
    @Body() flashcardDto: FlashcardDto,
  ): Promise<void> {
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
    await this.flashcardsService.saveOrUpdateFlashcard(
      flashcardDto,
      user.id,
      existing.kanji.character,
    );
  }

  @Delete('flashcards/:flashcardId')
  @ApiOperation({
    summary: 'Delete a flashcard',
    description: 'Delete a flashcard by its ID, ensuring it belongs to the user associated with the provided API key.',
  })
  @ApiParam({ name: 'flashcardId', description: 'ID of the flashcard to delete' })
  @ApiResponse({ status: 200, description: 'Successfully deleted flashcard' })
  @ApiResponse({ status: 401, description: 'Unauthorized - API key is missing or invalid' })
  @ApiResponse({ status: 404, description: 'Flashcard not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteFlashcard(
    @Req() req: Request,
    @Param('flashcardId', ParseIntPipe) flashcardId: number,
  ): Promise<void> {
    const user = req.user as User;
    const flashcard = await this.flashcardsService.getFlashcardByUserAndId(
      user.id,
      flashcardId,
    );
    await this.flashcardsService.deleteFlashcard(flashcard.id);
  }
}
