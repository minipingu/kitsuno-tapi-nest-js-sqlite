import {
  Controller,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiService } from './api.service';

@ApiTags('Vocabulary')
@Controller('api/vocabulary')
export class VocabularyController {
  constructor(private readonly apiService: ApiService) { }

  @Get('search')
  @ApiOperation({ summary: 'Search vocabulary and sentence examples (GET)' })
  @ApiResponse({ status: 200, description: 'Sentence examples from Jotoba' })
  async searchGet(@Query('query') query: string) {
    if (!query || !query.trim()) {
      return { query: '', sentences: [] };
    }
    const apiResponse = await this.apiService.getSentenceExamples(query.trim());
    return {
      query: query.trim(),
      ...apiResponse,
    };
  }

  @Post('search')
  @ApiOperation({ summary: 'Search vocabulary and sentence examples (POST)' })
  @ApiResponse({ status: 200, description: 'Sentence examples from Jotoba' })
  async searchPost(@Body('query') query: string) {
    if (!query || !query.trim()) {
      return { query: '', sentences: [] };
    }
    const apiResponse = await this.apiService.getSentenceExamples(query.trim());
    return {
      query: query.trim(),
      ...apiResponse,
    };
  }
}
