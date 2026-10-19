import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl =
      this.configService.get<string>('JOTOBA_API_URL') || 'https://jotoba.de/api';
  }

  async getSentenceExamples(query: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/search/sentences`,
        {
          query,
          language: 'English',
          no_english: false,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          timeout: 10000,
        },
      );
      return response.data;
    } catch (err) {
      this.logger.error(`Error fetching sentence examples from Jotoba: ${err.message}`);
      return {
        sentences: [],
      };
    }
  }
}
