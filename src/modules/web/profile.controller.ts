import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { FlashcardsService } from '../flashcards/flashcards.service';
import { SessionOrApiKeyGuard } from '../auth/guards/session-or-api-key.guard';
import { UpdateUsernameDto } from '../auth/dto/update-username.dto';
import { UpdatePasswordDto } from '../auth/dto/update-password.dto';
import { User } from '../../entities/user.entity';

@ApiTags('Profile')
@Controller()
@UseGuards(SessionOrApiKeyGuard)
export class ProfileController {
  constructor(
    private readonly authService: AuthService,
    private readonly flashcardsService: FlashcardsService,
  ) { }

  @Get(['api/profile', 'profile'])
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req: Request) {
    const sessionUser = req.user as User;
    const user = await this.authService.findById(sessionUser.id);
    const countFlashcards = await this.flashcardsService.countFlashcardsByUserId(
      user.id,
    );

    return {
      isAuthenticated: true,
      username: user.username,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        apiKey: user.apiKey,
        joinDate: user.joinDate,
      },
      countFlashcards,
    };
  }

  @Post(['api/profile/username', 'updateUsername'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user username' })
  async updateUsername(
    @Body() body: any,
    @Req() req: Request,
  ) {
    const sessionUser = req.user as User;
    const user = await this.authService.findById(sessionUser.id);
    const newUsername = (body.newUsername || body.username || '').trim();

    if (!newUsername) {
      throw new BadRequestException('New username is required');
    }

    try {
      const updatedUser = await this.authService.updateUsername(user, newUsername);
      req.user = updatedUser;
      return {
        success: true,
        message: 'Username was successfully updated',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          apiKey: updatedUser.apiKey,
          joinDate: updatedUser.joinDate,
        },
      };
    } catch (err: any) {
      throw new BadRequestException(err.message || 'Failed to update username');
    }
  }

  @Post(['api/profile/password', 'updatePassword'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user password' })
  async updatePassword(
    @Body() body: any,
    @Req() req: Request,
  ) {
    const sessionUser = req.user as User;
    const user = await this.authService.findById(sessionUser.id);
    const oldPassword = body.oldPassword || body.currentPassword || '';
    const newPassword = body.newPassword || '';
    const confirmPassword = body.confirmPassword || '';

    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new BadRequestException('All password fields are required');
    }

    try {
      await this.authService.updatePassword(
        user,
        oldPassword,
        newPassword,
        confirmPassword,
      );
      return {
        success: true,
        message: 'Password was successfully updated',
      };
    } catch (err: any) {
      throw new BadRequestException(err.message || 'Failed to update password');
    }
  }

  @Get(['api/profile/api-key', 'updateApiKey'])
  @Post(['api/profile/api-key', 'updateApiKey'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate a new API key' })
  async updateApiKey(@Req() req: Request) {
    const sessionUser = req.user as User;
    const user = await this.authService.findById(sessionUser.id);
    await this.authService.updateApiKey(user);
    const refreshed = await this.authService.findById(user.id);

    return {
      success: true,
      message: 'API Key regenerated successfully',
      apiKey: refreshed.apiKey,
    };
  }
}
