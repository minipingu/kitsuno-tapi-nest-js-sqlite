import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User } from '../../entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './session.serializer';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { ApiKeyGuard } from './guards/api-key.guard';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'local', session: true }),
    EmailModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    SessionSerializer,
    LocalAuthGuard,
    AuthenticatedGuard,
    ApiKeyGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService, AuthenticatedGuard, ApiKeyGuard],
})
export class AuthModule {}
