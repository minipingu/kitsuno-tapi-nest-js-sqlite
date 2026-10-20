import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionOrApiKeyGuard implements CanActivate {
  constructor(private readonly authService: AuthService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 1. Check Passport session (cookie)
    if (request.isAuthenticated && request.isAuthenticated() && request.user) {
      return true;
    }

    // 2. Check API Key header
    const apiKey =
      request.headers['api-key'] ||
      request.headers['API-KEY'] ||
      request.headers['x-api-key'];

    if (apiKey) {
      const user = await this.authService.findByApiKey(apiKey as string);
      if (user) {
        request.user = user;
        return true;
      }
      throw new UnauthorizedException('Invalid API Key');
    }

    throw new UnauthorizedException('Authentication required (Session cookie or API-KEY header)');
  }
}
