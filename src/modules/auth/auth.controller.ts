import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '../../entities/user.entity';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('api/auth/me')
  @ApiOperation({ summary: 'Get current authenticated user' })
  async getMe(@Req() req: Request) {
    const isAuthenticated = Boolean(req.isAuthenticated && req.isAuthenticated());
    if (!isAuthenticated || !req.user) {
      return { isAuthenticated: false, user: null };
    }
    const sessionUser = req.user as User;
    const user = await this.authService.findById(sessionUser.id);
    if (!user) {
      return { isAuthenticated: false, user: null };
    }
    return {
      isAuthenticated: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        apiKey: user.apiKey,
        joinDate: user.joinDate,
      },
    };
  }

  @Post(['api/auth/register', 'register'])
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Registration failed',
      };
    }
    return {
      success: true,
      message:
        "We've sent you a verification email. Click the link inside to activate your account.",
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post(['api/auth/login', 'login'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in with username and password' })
  async login(@Req() req: Request) {
    const user = req.user as User;
    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        apiKey: user.apiKey,
        joinDate: user.joinDate,
      },
    };
  }

  @Post(['api/auth/logout', 'logout'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log out current session' })
  async logout(@Req() req: Request) {
    return new Promise((resolve) => {
      req.logout((err) => {
        if (err) {
          console.error('Logout error:', err);
        }
        resolve({
          success: true,
          message: 'Logged out successfully',
        });
      });
    });
  }

  @Get(['api/auth/verify', 'verify'])
  @ApiOperation({ summary: 'Verify email with token' })
  async verify(@Query('token') token: string) {
    if (!token) {
      return {
        success: false,
        message: 'Verification token is required',
      };
    }
    const verified = await this.authService.verifyUser(token);
    return {
      success: verified,
      message: verified
        ? 'Congratulations, your account has been verified!'
        : "Sorry, we couldn't verify your account. It may already be verified or the token might be invalid.",
    };
  }

  @Post(['api/auth/resend-verification', 'resend-verification'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend verification email' })
  async resendVerification(@Body() dto: ResendVerificationDto) {
    if (!dto.email) {
      return {
        success: false,
        error: 'Email is required',
      };
    }
    await this.authService.updateVerificationToken(dto.email);
    return {
      success: true,
      message:
        'If the email is linked to an unverified account, a new verification email has been sent.',
    };
  }
}
