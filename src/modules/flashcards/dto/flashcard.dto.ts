import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FlashcardDto {
  @ApiPropertyOptional({ maxLength: 8 })
  @IsOptional()
  @IsString()
  @MaxLength(8, { message: 'Vocabulary word must not exceed 8 characters' })
  vocabWord1?: string;

  @ApiPropertyOptional({ maxLength: 24 })
  @IsOptional()
  @IsString()
  @MaxLength(24, { message: 'Vocabulary meaning must not exceed 24 characters' })
  vocabMeaning1?: string;

  @ApiPropertyOptional({ maxLength: 8 })
  @IsOptional()
  @IsString()
  @MaxLength(8, { message: 'Vocabulary word must not exceed 8 characters' })
  vocabWord2?: string;

  @ApiPropertyOptional({ maxLength: 24 })
  @IsOptional()
  @IsString()
  @MaxLength(24, { message: 'Vocabulary meaning must not exceed 24 characters' })
  vocabMeaning2?: string;

  @ApiPropertyOptional({ maxLength: 8 })
  @IsOptional()
  @IsString()
  @MaxLength(8, { message: 'Vocabulary word must not exceed 8 characters' })
  vocabWord3?: string;

  @ApiPropertyOptional({ maxLength: 24 })
  @IsOptional()
  @IsString()
  @MaxLength(24, { message: 'Vocabulary meaning must not exceed 24 characters' })
  vocabMeaning3?: string;

  @ApiPropertyOptional({ maxLength: 8 })
  @IsOptional()
  @IsString()
  @MaxLength(8, { message: 'Vocabulary word must not exceed 8 characters' })
  vocabWord4?: string;

  @ApiPropertyOptional({ maxLength: 24 })
  @IsOptional()
  @IsString()
  @MaxLength(24, { message: 'Vocabulary meaning must not exceed 24 characters' })
  vocabMeaning4?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Notes must not exceed 200 characters' })
  notes?: string;

  @ApiPropertyOptional({ description: 'Kanji ID (required for POST)' })
  @IsOptional()
  kanjiId?: number;

  userId?: number;

  hasAtLeastOneVocabPair(): boolean {
    return Boolean(
      (this.vocabWord1 && this.vocabWord1.trim() && this.vocabMeaning1 && this.vocabMeaning1.trim()) ||
      (this.vocabWord2 && this.vocabWord2.trim() && this.vocabMeaning2 && this.vocabMeaning2.trim()) ||
      (this.vocabWord3 && this.vocabWord3.trim() && this.vocabMeaning3 && this.vocabMeaning3.trim()) ||
      (this.vocabWord4 && this.vocabWord4.trim() && this.vocabMeaning4 && this.vocabMeaning4.trim()),
    );
  }

  getVocabularyAsArray(): string[] {
    const vocabList: string[] = [];
    const words = [this.vocabWord1, this.vocabWord2, this.vocabWord3, this.vocabWord4];
    const meanings = [this.vocabMeaning1, this.vocabMeaning2, this.vocabMeaning3, this.vocabMeaning4];

    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const m = meanings[i];
      if (w && w.trim() && m && m.trim()) {
        const cleanWord = w.trim().replace(/\s+/g, '');
        const cleanMeaning = m.trim().replace(/\s+/g, ' ');
        vocabList.push(`${cleanWord} ${cleanMeaning}`);
      }
    }
    return vocabList;
  }
}
