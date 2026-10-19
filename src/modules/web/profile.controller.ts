import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  Render,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { FlashcardsService } from '../flashcards/flashcards.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { UpdateUsernameDto } from '../auth/dto/update-username.dto';
import { UpdatePasswordDto } from '../auth/dto/update-password.dto';
import { User } from '../../entities/user.entity';

@Controller()
@UseGuards(AuthenticatedGuard)
export class ProfileController {
  constructor(
    private readonly authService: AuthService,
    private readonly flashcardsService: FlashcardsService,
  ) {}

  @Get('profile')
  @Render('profile')
  async showProfile(@Req() req: Request) {
    const sessionUser = req.user as User;
    const user = await this.authService.findById(sessionUser.id);
    const countFlashcards = await this.flashcardsService.countFlashcardsByUserId(
      user.id,
    );

    const usernameSuccess = (req.session as any)?.usernameSuccess;
    const passwordSuccess = (req.session as any)?.passwordSuccess;
    if ((req.session as any)?.usernameSuccess) delete (req.session as any).usernameSuccess;
    if ((req.session as any)?.passwordSuccess) delete (req.session as any).passwordSuccess;

    return {
      isAuthenticated: true,
      username: user.username,
      user,
      countFlashcards,
      usernameSuccess,
      passwordSuccess,
      errors: {},
    };
  }

  @Post('updateUsername')
  async updateUsername(
    @Body() dto: UpdateUsernameDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const sessionUser = req.user as User;
    const user = await this.authService.findById(sessionUser.id);

    try {
      const updatedUser = await this.authService.updateUsername(user, dto.newUsername);
      // Update session user
      req.user = updatedUser;
      (req.session as any).usernameSuccess = 'Username was successfully updated';
      return res.redirect('/profile');
    } catch (err) {
      const countFlashcards = await this.flashcardsService.countFlashcardsByUserId(
        user.id,
      );
      return res.render('profile', {
        isAuthenticated: true,
        username: user.username,
        user,
        countFlashcards,
        usernameError: err.message,
      });
    }
  }

  @Post('updatePassword')
  async updatePassword(
    @Body() dto: UpdatePasswordDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const sessionUser = req.user as User;
    const user = await this.authService.findById(sessionUser.id);

    try {
      await this.authService.updatePassword(
        user,
        dto.oldPassword,
        dto.newPassword,
        dto.confirmPassword,
      );
      (req.session as any).passwordSuccess = 'Password was successfully updated';
      return res.redirect('/profile');
    } catch (err) {
      const countFlashcards = await this.flashcardsService.countFlashcardsByUserId(
        user.id,
      );
      return res.render('profile', {
        isAuthenticated: true,
        username: user.username,
        user,
        countFlashcards,
        passwordError: err.message,
      });
    }
  }

  @Get('updateApiKey')
  async updateApiKey(@Req() req: Request, @Res() res: Response) {
    const sessionUser = req.user as User;
    const user = await this.authService.findById(sessionUser.id);
    await this.authService.updateApiKey(user);
    return res.redirect('/profile');
  }
}
