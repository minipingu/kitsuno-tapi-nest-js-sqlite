import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kanji } from '../../entities/kanji.entity';

@Injectable()
export class KanjiService {
  constructor(
    @InjectRepository(Kanji)
    private readonly kanjiRepository: Repository<Kanji>,
  ) {}

  async findKanjiById(id: number): Promise<Kanji> {
    const kanji = await this.kanjiRepository.findOne({ where: { id } });
    if (!kanji) {
      throw new NotFoundException(`Kanji character not found for id: ${id}`);
    }
    return kanji;
  }

  async findKanjiByCharacter(character: string): Promise<Kanji> {
    const kanji = await this.kanjiRepository.findOne({ where: { character } });
    if (!kanji) {
      throw new NotFoundException(`Kanji character not found: ${character}`);
    }
    return kanji;
  }

  async findAll(): Promise<Kanji[]> {
    return this.kanjiRepository.find({ order: { id: 'ASC' } });
  }

  async findAllByGrade(grade: number): Promise<Kanji[]> {
    const kanjiList = await this.kanjiRepository.find({
      where: { grade },
      order: { id: 'ASC' },
    });
    if (!kanjiList || kanjiList.length === 0) {
      throw new NotFoundException(`Kanji characters not found for grade: ${grade}`);
    }
    return kanjiList;
  }

  async findAllGrades(): Promise<number[]> {
    const kanjis = await this.kanjiRepository
      .createQueryBuilder('kanji')
      .select('DISTINCT kanji.grade', 'grade')
      .orderBy('kanji.grade', 'ASC')
      .getRawMany();

    return kanjis.map((k) => k.grade);
  }

  async findAllGroupedByGrade(): Promise<Record<number, Kanji[]>> {
    const kanjiList = await this.findAll();
    kanjiList.sort((a, b) => a.grade - b.grade);

    const kanjiMap: Record<number, Kanji[]> = {};
    for (const kanji of kanjiList) {
      const grade = kanji.grade;
      if (!kanjiMap[grade]) {
        kanjiMap[grade] = [];
      }
      kanjiMap[grade].push(kanji);
    }

    return kanjiMap;
  }
}
