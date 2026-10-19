import { ApiProperty } from '@nestjs/swagger';

export class FlashcardResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  kanjiCharacter: string;

  @ApiProperty()
  kanjiGrade: number;

  @ApiProperty()
  kanjiMeanings: string;

  @ApiProperty({ type: [String] })
  onyomiReadings: string[];

  @ApiProperty({ type: [String] })
  kunyomiReadings: string[];

  @ApiProperty({ type: [String] })
  vocabulary: string[];

  @ApiProperty()
  notes: string;

  constructor(
    id: number,
    kanjiCharacter: string,
    kanjiGrade: number,
    kanjiMeanings: string,
    onyomiReadings: string[],
    kunyomiReadings: string[],
    vocabulary: string[],
    notes: string,
  ) {
    this.id = id;
    this.kanjiCharacter = kanjiCharacter;
    this.kanjiGrade = kanjiGrade;
    this.kanjiMeanings = kanjiMeanings;
    this.onyomiReadings = onyomiReadings || [];
    this.kunyomiReadings = kunyomiReadings || [];
    this.vocabulary = vocabulary || [];
    this.notes = notes || '';
  }
}
