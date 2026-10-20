import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { HiraganaService } from './hiragana.service';
import { KatakanaService } from './katakana.service';
import { KanjiService } from './kanji.service';
import { KanaUtils } from './utils/kana.utils';
import { Hiragana } from '../../entities/hiragana.entity';
import { Katakana } from '../../entities/katakana.entity';
import { Kanji } from '../../entities/kanji.entity';

@ApiTags('Characters')
@Controller('api')
export class CharactersController {
  constructor(
    private readonly hiraganaService: HiraganaService,
    private readonly katakanaService: KatakanaService,
    private readonly kanjiService: KanjiService,
  ) { }

  @Get('hiragana')
  @ApiOperation({
    summary: 'Get all Hiragana characters',
    description: 'Retrieve a list of all available Hiragana characters.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved Hiragana list', type: [Hiragana] })
  async getAllHiragana(): Promise<Hiragana[]> {
    return this.hiraganaService.findAll();
  }

  @Get('hiragana/grouped')
  @ApiOperation({ summary: 'Get Hiragana characters with grid format and variants' })
  async getHiraganaGrouped() {
    const raw = await this.hiraganaService.findAll();
    const formatted = KanaUtils.formatKana(raw);
    const variants = KanaUtils.getHiraganaVariants();
    return { raw, formatted, variants };
  }

  @Get('hiragana/:romaji')
  @ApiOperation({
    summary: 'Get Hiragana character by romaji',
    description: 'Retrieve a specific Hiragana character by its romaji representation.',
  })
  @ApiParam({ name: 'romaji', description: 'Hiragana romaji character' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved Hiragana character', type: Hiragana })
  @ApiResponse({ status: 404, description: 'Hiragana character not found' })
  async getHiraganaByRomaji(@Param('romaji') romaji: string): Promise<Hiragana> {
    return this.hiraganaService.findByCharacter(romaji);
  }

  @Get('katakana')
  @ApiOperation({
    summary: 'Get all Katakana characters',
    description: 'Retrieve a list of all available Katakana characters.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved Katakana list', type: [Katakana] })
  async getAllKatakana(): Promise<Katakana[]> {
    return this.katakanaService.findAll();
  }

  @Get('katakana/grouped')
  @ApiOperation({ summary: 'Get Katakana characters with grid format and variants' })
  async getKatakanaGrouped() {
    const raw = await this.katakanaService.findAll();
    const formatted = KanaUtils.formatKana(raw);
    const variants = KanaUtils.getKatakanaVariants();
    return { raw, formatted, variants };
  }

  @Get('katakana/:romaji')
  @ApiOperation({
    summary: 'Get Katakana character by romaji',
    description: 'Retrieve a specific Katakana character by its romaji representation.',
  })
  @ApiParam({ name: 'romaji', description: 'Katakana romaji character' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved Katakana character', type: Katakana })
  @ApiResponse({ status: 404, description: 'Katakana character not found' })
  async getKatakanaByRomaji(@Param('romaji') romaji: string): Promise<Katakana> {
    return this.katakanaService.findByCharacter(romaji);
  }

  @Get('kanji')
  @ApiOperation({
    summary: 'Get all Kanji characters',
    description: 'Retrieve a list of all available Kanji characters.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved Kanji list', type: [Kanji] })
  async getAllKanji(): Promise<Kanji[]> {
    return this.kanjiService.findAll();
  }

  @Get('kanji/grouped')
  @ApiOperation({ summary: 'Get all Kanji grouped by grade' })
  async getKanjiGrouped() {
    return this.kanjiService.findAllGroupedByGrade();
  }

  @Get('kanji/character/:character')
  @ApiOperation({ summary: 'Get Kanji details by character symbol' })
  async getKanjiByCharacter(@Param('character') character: string): Promise<Kanji> {
    return this.kanjiService.findKanjiByCharacter(character);
  }

  @Get('kanji/:id')
  @ApiOperation({
    summary: 'Get Kanji character by ID',
    description: 'Retrieve a specific Kanji character by its unique ID.',
  })
  @ApiParam({ name: 'id', description: 'Kanji character ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved Kanji character', type: Kanji })
  @ApiResponse({ status: 404, description: 'Kanji character not found' })
  async getKanjiById(@Param('id', ParseIntPipe) id: number): Promise<Kanji> {
    return this.kanjiService.findKanjiById(id);
  }
}
