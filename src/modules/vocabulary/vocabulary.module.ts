import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { VocabularyController } from './vocabulary.controller';

@Module({
  controllers: [VocabularyController],
  providers: [ApiService],
  exports: [ApiService],
})
export class VocabularyModule { }
