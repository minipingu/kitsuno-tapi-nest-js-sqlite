import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['api-key'] || request.headers['API-KEY'];

    if (!apiKey) {
      throw new UnauthorizedException('API Key is missing');
    }

    const user = await this.authService.findByApiKey(apiKey as string);
    if (!user) {
      throw new UnauthorizedException('Invalid API Key');
    }

    request.user = user;
    return true;
  }
}
