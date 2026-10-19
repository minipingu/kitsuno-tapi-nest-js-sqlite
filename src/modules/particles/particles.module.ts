import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Particle } from '../../entities/particle.entity';
import { ParticlesService } from './particles.service';
import { ParticlesController } from './particles.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Particle]), AuthModule],
  providers: [ParticlesService],
  controllers: [ParticlesController],
  exports: [ParticlesService],
})
export class ParticlesModule {}
