import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flashcard } from '../../entities/flashcard.entity';
import { FlashcardsService } from './flashcards.service';
import { FlashcardsController } from './flashcards.controller';
import { FlashcardWebController } from './flashcard-web.controller';
import { CharactersModule } from '../characters/characters.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Flashcard]),
    CharactersModule,
    AuthModule,
  ],
  providers: [FlashcardsService],
  controllers: [FlashcardsController, FlashcardWebController],
  exports: [FlashcardsService],
})
export class FlashcardsModule {}
