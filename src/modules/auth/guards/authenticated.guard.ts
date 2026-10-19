import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();

    if (request.isAuthenticated && request.isAuthenticated()) {
      return true;
    }

    // If it's a browser page navigation, redirect to /login
    if (request.headers.accept && request.headers.accept.includes('text/html')) {
      response.redirect('/login');
      return false;
    }

    throw new UnauthorizedException('Authentication required');
  }
}
