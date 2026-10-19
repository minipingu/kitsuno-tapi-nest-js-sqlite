import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Particle } from '../../entities/particle.entity';

@Injectable()
export class ParticlesService {
  constructor(
    @InjectRepository(Particle)
    private readonly particleRepository: Repository<Particle>,
  ) {}

  async findAll(): Promise<Particle[]> {
    return this.particleRepository.find({ order: { id: 'ASC' } });
  }
}
