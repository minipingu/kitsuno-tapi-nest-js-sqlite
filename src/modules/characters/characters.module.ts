import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hiragana } from '../../entities/hiragana.entity';
import { Katakana } from '../../entities/katakana.entity';
import { Kanji } from '../../entities/kanji.entity';
import { HiraganaService } from './hiragana.service';
import { KatakanaService } from './katakana.service';
import { KanjiService } from './kanji.service';
import { CharactersController } from './characters.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Hiragana, Katakana, Kanji]), AuthModule],
  providers: [HiraganaService, KatakanaService, KanjiService],
  controllers: [CharactersController],
  exports: [HiraganaService, KatakanaService, KanjiService],
})
export class CharactersModule {}
