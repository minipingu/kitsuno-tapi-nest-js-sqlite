import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { ParticlesService } from './particles.service';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { Particle } from '../../entities/particle.entity';

@ApiTags('Particles')
@ApiHeader({
  name: 'API-KEY',
  description: 'Your Kitsuno API key',
  required: true,
})
@UseGuards(ApiKeyGuard)
@Controller('api')
export class ParticlesController {
  constructor(private readonly particlesService: ParticlesService) {}

  @Get('particles')
  @ApiOperation({
    summary: 'Get all Japanese particles',
    description: 'Retrieve a list of all available Japanese particles.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved particle list', type: [Particle] })
  @ApiResponse({ status: 401, description: 'Unauthorized - API key is missing or invalid' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllParticles(): Promise<Particle[]> {
    return this.particlesService.findAll();
  }
}
