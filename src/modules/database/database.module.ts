import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  Hiragana,
  Katakana,
  Kanji,
  Particle,
  Flashcard,
} from '../../entities';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Hiragana,
      Katakana,
      Kanji,
      Particle,
      Flashcard,
    ]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class DatabaseModule {}
