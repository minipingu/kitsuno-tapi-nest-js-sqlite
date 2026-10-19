import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flashcard } from '../../entities/flashcard.entity';
import { KanjiService } from '../characters/kanji.service';
import { AuthService } from '../auth/auth.service';
import { FlashcardDto } from './dto/flashcard.dto';
import { FlashcardResponseDto } from './dto/flashcard-response.dto';

@Injectable()
export class FlashcardsService {
  constructor(
    @InjectRepository(Flashcard)
    private readonly flashcardRepository: Repository<Flashcard>,
    private readonly kanjiService: KanjiService,
    private readonly authService: AuthService,
  ) {}

  async getAllFlashcardsByUserId(userId: number): Promise<Flashcard[]> {
    return this.flashcardRepository.find({
      where: { user: { id: userId } },
      relations: ['kanji', 'user'],
      order: { id: 'ASC' },
    });
  }

  async countFlashcardsByUserId(userId: number): Promise<number> {
    return this.flashcardRepository.count({
      where: { user: { id: userId } },
    });
  }

  async getFlashcardById(id: number): Promise<Flashcard> {
    const flashcard = await this.flashcardRepository.findOne({
      where: { id },
      relations: ['kanji', 'user'],
    });
    if (!flashcard) {
      throw new NotFoundException(`Flashcard with id ${id} not found`);
    }
    return flashcard;
  }

  async getFlashcardByUserAndId(userId: number, flashcardId: number): Promise<Flashcard> {
    const flashcard = await this.flashcardRepository.findOne({
      where: { id: flashcardId, user: { id: userId } },
      relations: ['kanji', 'user'],
    });
    if (!flashcard) {
      throw new NotFoundException(
        `Flashcard with id ${flashcardId} was not found for the current user`,
      );
    }
    return flashcard;
  }

  async getFlashcardByUserAndKanji(
    userId: number,
    character: string,
  ): Promise<Flashcard | null> {
    return this.flashcardRepository.findOne({
      where: { user: { id: userId }, kanji: { character } },
      relations: ['kanji', 'user'],
    });
  }

  async saveOrUpdateFlashcard(
    flashcardDto: FlashcardDto,
    userId: number,
    kanjiCharacter: string,
  ): Promise<Flashcard> {
    let flashcard = await this.getFlashcardByUserAndKanji(userId, kanjiCharacter);
    if (!flashcard) {
      flashcard = new Flashcard();
    }

    const kanji = await this.kanjiService.findKanjiById(flashcardDto.kanjiId);
    const user = await this.authService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User not found: ${userId}`);
    }

    flashcard.kanji = kanji;
    flashcard.user = user;
    flashcard.vocabulary = flashcardDto.getVocabularyAsArray();
    flashcard.notes = flashcardDto.notes || '';

    return this.flashcardRepository.save(flashcard);
  }

  async deleteFlashcard(id: number): Promise<void> {
    const flashcard = await this.getFlashcardById(id);
    await this.flashcardRepository.remove(flashcard);
  }

  toDto(flashcard: Flashcard): FlashcardResponseDto {
    return new FlashcardResponseDto(
      flashcard.id,
      flashcard.kanji.character,
      flashcard.kanji.grade,
      flashcard.kanji.meanings,
      flashcard.kanji.onyomiReadings,
      flashcard.kanji.kunyomiReadings,
      flashcard.vocabulary,
      flashcard.notes,
    );
  }
}
