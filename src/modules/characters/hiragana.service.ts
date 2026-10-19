import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hiragana } from '../../entities/hiragana.entity';

@Injectable()
export class HiraganaService {
  constructor(
    @InjectRepository(Hiragana)
    private readonly hiraganaRepository: Repository<Hiragana>,
  ) {}

  async findAll(): Promise<Hiragana[]> {
    return this.hiraganaRepository.find({ order: { id: 'ASC' } });
  }

  async findByCharacter(romaji: string): Promise<Hiragana> {
    const hiragana = await this.hiraganaRepository.findOne({
      where: { romaji },
    });
    if (!hiragana) {
      throw new NotFoundException(`Hiragana romaji not found: ${romaji}`);
    }
    return hiragana;
  }
}
