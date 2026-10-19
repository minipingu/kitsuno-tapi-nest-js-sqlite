import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Katakana } from '../../entities/katakana.entity';

@Injectable()
export class KatakanaService {
  constructor(
    @InjectRepository(Katakana)
    private readonly katakanaRepository: Repository<Katakana>,
  ) {}

  async findAll(): Promise<Katakana[]> {
    return this.katakanaRepository.find({ order: { id: 'ASC' } });
  }

  async findByCharacter(romaji: string): Promise<Katakana> {
    const katakana = await this.katakanaRepository.findOne({
      where: { romaji },
    });
    if (!katakana) {
      throw new NotFoundException(`Katakana romaji not found: ${romaji}`);
    }
    return katakana;
  }
}
