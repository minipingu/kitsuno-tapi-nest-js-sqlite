import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ParticlesService } from './particles.service';
import { Particle } from '../../entities/particle.entity';

@ApiTags('Particles')
@Controller('api')
export class ParticlesController {
  constructor(private readonly particlesService: ParticlesService) { }

  @Get('particles')
  @ApiOperation({
    summary: 'Get all Japanese particles',
    description: 'Retrieve a list of all available Japanese particles.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved particle list', type: [Particle] })
  async getAllParticles(): Promise<Particle[]> {
    return this.particlesService.findAll();
  }
}
