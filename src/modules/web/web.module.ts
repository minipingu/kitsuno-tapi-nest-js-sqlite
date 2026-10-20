import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { VocabularyModule } from '../vocabulary/vocabulary.module';
import { CharactersModule } from '../characters/characters.module';
import { ParticlesModule } from '../particles/particles.module';
import { FlashcardsModule } from '../flashcards/flashcards.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    VocabularyModule,
    CharactersModule,
    ParticlesModule,
    FlashcardsModule,
    AuthModule,
  ],
  controllers: [ProfileController],
})
export class WebModule { }
