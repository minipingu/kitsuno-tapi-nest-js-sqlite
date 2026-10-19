import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiParam,
} from '@nestjs/swagger';
import { HiraganaService } from './hiragana.service';
import { KatakanaService } from './katakana.service';
import { KanjiService } from './kanji.service';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { Hiragana } from '../../entities/hiragana.entity';
import { Katakana } from '../../entities/katakana.entity';
import { Kanji } from '../../entities/kanji.entity';

@ApiTags('Characters')
@ApiHeader({
  name: 'API-KEY',
  description: 'Your Kitsuno API key',
  required: true,
})
@UseGuards(ApiKeyGuard)
@Controller('api')
export class CharactersController {
  constructor(
    private readonly hiraganaService: HiraganaService,
    private readonly katakanaService: KatakanaService,
    private readonly kanjiService: KanjiService,
  ) {}

  @Get('hiragana')
  @ApiOperation({
    summary: 'Get all Hiragana characters',
    description: 'Retrieve a list of all available Hiragana characters.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved Hiragana list', type: [Hiragana] })
  @ApiResponse({ status: 401, description: 'Unauthorized - API key is missing or invalid' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllHiragana(): Promise<Hiragana[]> {
    return this.hiraganaService.findAll();
  }

  @Get('hiragana/:romaji')
  @ApiOperation({
    summary: 'Get Hiragana character by romaji',
    description: 'Retrieve a specific Hiragana character by its romaji representation.',
  })
  @ApiParam({ name: 'romaji', description: 'Hiragana romaji character' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved Hiragana character', type: Hiragana })
  @ApiResponse({ status: 401, description: 'Unauthorized - API key is missing or invalid' })
  @ApiResponse({ status: 404, description: 'Hiragana character not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getHiraganaByRomaji(@Param('romaji') romaji: string): Promise<Hiragana> {
    return this.hiraganaService.findByCharacter(romaji);
  }

  @Get('katakana')
  @ApiOperation({
    summary: 'Get all Katakana characters',
    description: 'Retrieve a list of all available Katakana characters.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved Katakana list', type: [Katakana] })
  @ApiResponse({ status: 401, description: 'Unauthorized - API key is missing or invalid' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllKatakana(): Promise<Katakana[]> {
    return this.katakanaService.findAll();
  }

  @Get('katakana/:romaji')
  @ApiOperation({
    summary: 'Get Katakana character by romaji',
    description: 'Retrieve a specific Katakana character by its romaji representation.',
  })
  @ApiParam({ name: 'romaji', description: 'Katakana romaji character' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved Katakana character', type: Katakana })
  @ApiResponse({ status: 401, description: 'Unauthorized - API key is missing or invalid' })
  @ApiResponse({ status: 404, description: 'Katakana character not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getKatakanaByRomaji(@Param('romaji') romaji: string): Promise<Katakana> {
    return this.katakanaService.findByCharacter(romaji);
  }

  @Get('kanji')
  @ApiOperation({
    summary: 'Get all Kanji characters',
    description: 'Retrieve a list of all available Kanji characters.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved Kanji list', type: [Kanji] })
  @ApiResponse({ status: 401, description: 'Unauthorized - API key is missing or invalid' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllKanji(): Promise<Kanji[]> {
    return this.kanjiService.findAll();
  }

  @Get('kanji/:id')
  @ApiOperation({
    summary: 'Get Kanji character by ID',
    description: 'Retrieve a specific Kanji character by its unique ID.',
  })
  @ApiParam({ name: 'id', description: 'Kanji character ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved Kanji character', type: Kanji })
  @ApiResponse({ status: 401, description: 'Unauthorized - API key is missing or invalid' })
  @ApiResponse({ status: 404, description: 'Kanji character not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getKanjiById(@Param('id', ParseIntPipe) id: number): Promise<Kanji> {
    return this.kanjiService.findKanjiById(id);
  }
}
