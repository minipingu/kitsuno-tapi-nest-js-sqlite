import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  Res,
  Render,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiService } from '../vocabulary/api.service';
import { HiraganaService } from '../characters/hiragana.service';
import { KatakanaService } from '../characters/katakana.service';
import { KanjiService } from '../characters/kanji.service';
import { ParticlesService } from '../particles/particles.service';
import { FlashcardsService } from '../flashcards/flashcards.service';
import { KanaUtils } from '../characters/utils/kana.utils';
import { User } from '../../entities/user.entity';

@Controller()
export class WebController {
  constructor(
    private readonly apiService: ApiService,
    private readonly hiraganaService: HiraganaService,
    private readonly katakanaService: KatakanaService,
    private readonly kanjiService: KanjiService,
    private readonly particlesService: ParticlesService,
    private readonly flashcardsService: FlashcardsService,
  ) {}

  @Get()
  @Render('welcome')
  showWelcome(@Req() req: Request) {
    const isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
    const user = req.user as User;
    return {
      isAuthenticated,
      username: user?.username,
    };
  }

  @Get('vocabulary')
  @Render('vocabulary')
  showVocabulary(@Req() req: Request) {
    const isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
    const user = req.user as User;
    return {
      isAuthenticated,
      username: user?.username,
      apiResponse: null,
      query: null,
    };
  }

  @Post('vocabulary')
  @Render('vocabulary')
  async getSentenceExamples(
    @Body('query') query: string,
    @Req() req: Request,
  ) {
    const isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
    const user = req.user as User;
    const apiResponse = await this.apiService.getSentenceExamples(query);

    return {
      isAuthenticated,
      username: user?.username,
      query,
      apiResponse,
    };
  }

  @Get('hiragana')
  @Render('hiragana')
  async showHiragana(@Req() req: Request) {
    const isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
    const user = req.user as User;

    const hiraganaList = await this.hiraganaService.findAll();
    const formattedHiraganaList = KanaUtils.formatKana(hiraganaList);
    const hiraganaVariants = KanaUtils.getHiraganaVariants();

    return {
      isAuthenticated,
      username: user?.username,
      hiraganaList: formattedHiraganaList,
      rawHiraganaList: hiraganaList,
      hiraganaVariants,
    };
  }

  @Get('practice-hiragana')
  @Render('hiragana-practice')
  showPracticeHiragana(@Req() req: Request) {
    const isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
    const user = req.user as User;
    return {
      isAuthenticated,
      username: user?.username,
    };
  }

  @Get('katakana')
  @Render('katakana')
  async showKatakana(@Req() req: Request) {
    const isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
    const user = req.user as User;

    const katakanaList = await this.katakanaService.findAll();
    const formattedKatakanaList = KanaUtils.formatKana(katakanaList);
    const katakanaVariants = KanaUtils.getKatakanaVariants();

    return {
      isAuthenticated,
      username: user?.username,
      katakanaList: formattedKatakanaList,
      rawKatakanaList: katakanaList,
      katakanaVariants,
    };
  }

  @Get('practice-katakana')
  @Render('katakana-practice')
  showPracticeKatakana(@Req() req: Request) {
    const isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
    const user = req.user as User;
    return {
      isAuthenticated,
      username: user?.username,
    };
  }

  @Get('kanji')
  @Render('kanji')
  async showKanji(@Req() req: Request) {
    const isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
    const user = req.user as User;

    const kanjiMap = await this.kanjiService.findAllGroupedByGrade();
    // Convert kanjiMap to array of { grade, kanjis } for easy template iteration
    const kanjiEntries = Object.entries(kanjiMap).map(([grade, list]) => ({
      grade: Number(grade),
      gradeLabel: grade === '7' ? '7+' : grade,
      kanjis: list,
    }));

    return {
      isAuthenticated,
      username: user?.username,
      kanjiEntries,
    };
  }

  @Get('kanji/:character')
  @Render('kanji-details')
  async showKanjiDetails(
    @Param('character') character: string,
    @Req() req: Request,
  ) {
    const isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
    const user = req.user as User;

    const kanji = await this.kanjiService.findKanjiByCharacter(character);
    let hasFlashcard = false;
    let userId: number | null = null;

    if (isAuthenticated && user) {
      userId = user.id;
      const flashcard = await this.flashcardsService.getFlashcardByUserAndKanji(
        user.id,
        character,
      );
      hasFlashcard = !!flashcard;
    }

    return {
      isAuthenticated,
      username: user?.username,
      kanji,
      userId,
      hasFlashcard,
      hasError: false,
      flashcardDTO: {},
    };
  }

  @Get('particles')
  @Render('particles')
  async showParticles(@Req() req: Request) {
    const isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
    const user = req.user as User;
    const particlesList = await this.particlesService.findAll();

    return {
      isAuthenticated,
      username: user?.username,
      particlesList,
    };
  }

  @Get('about')
  @Render('about')
  showAbout(@Req() req: Request) {
    const isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
    const user = req.user as User;
    return {
      isAuthenticated,
      username: user?.username,
    };
  }

  @Get('privacypolicy')
  @Render('privacypolicy')
  showPrivacyPolicy() {
    return {};
  }

  @Get('tos')
  @Render('tos')
  showToS() {
    return {};
  }
}
