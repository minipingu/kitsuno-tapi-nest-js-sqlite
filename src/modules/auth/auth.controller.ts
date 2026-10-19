import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  Res,
  Render,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('register')
  @Render('register')
  showRegistrationForm(@Req() req: Request) {
    const isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
    const user = req.user as any;
    return {
      isAuthenticated,
      username: user?.username,
      errors: {},
      form: {},
    };
  }

  @Post('register')
  async registerUser(
    @Body() registerDto: RegisterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
    const user = req.user as any;

    const result = await this.authService.register(registerDto);
    if (!result.success) {
      return res.render('register', {
        isAuthenticated,
        username: user?.username,
        generalError: result.error,
        form: registerDto,
      });
    }

    (req.session as any).verificationMessage =
      "We've sent you a verification email. Click the link inside to activate your account.";
    return res.redirect('/login');
  }

  @Get('verify')
  @Render('verify')
  async verify(@Query('token') token: string) {
    const verified = await this.authService.verifyUser(token);
    return {
      message: verified
        ? 'Congratulations, your account has been verified!'
        : "Sorry, we couldn't verify your account. It may already be verified or the token might be invalid.",
    };
  }

  @Get('resend-verification')
  @Render('resend-verification')
  showResendVerificationForm(@Req() req: Request) {
    const isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
    const user = req.user as any;
    return {
      isAuthenticated,
      username: user?.username,
      message: null,
    };
  }

  @Post('resend-verification')
  @Render('resend-verification')
  async resendVerificationEmail(
    @Body() dto: ResendVerificationDto,
    @Req() req: Request,
  ) {
    const isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
    const user = req.user as any;

    await this.authService.updateVerificationToken(dto.email);
    return {
      isAuthenticated,
      username: user?.username,
      message:
        'If the email is linked to an unverified account, a new verification email has been sent.',
    };
  }

  @Get('login')
  showLoginForm(
    @Req() req: Request,
    @Res() res: Response,
    @Query('error') error?: string,
    @Query('logout') logout?: string,
  ) {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return res.redirect('/logout');
    }

    const verificationMessage = (req.session as any)?.verificationMessage;
    if ((req.session as any)?.verificationMessage) {
      delete (req.session as any).verificationMessage;
    }

    return res.render('login', {
      hasError: error !== undefined,
      isLogout: logout !== undefined,
      verificationMessage,
      isAuthenticated: false,
    });
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Req() req: Request, @Res() res: Response) {
    // Default success url in Spring Boot is /vocabulary
    return res.redirect('/vocabulary');
  }

  @Get('logout')
  @Render('logout')
  showLogoutForm(@Req() req: Request) {
    const isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
    const user = req.user as any;
    return {
      isAuthenticated,
      username: user?.username,
    };
  }

  @Post('logout')
  logoutUser(@Req() req: Request, @Res() res: Response) {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      return res.redirect('/login?logout');
    });
  }
}
