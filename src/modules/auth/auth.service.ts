import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs';
import { randomBytes, randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      return null;
    }

    if (!user.enabled) {
      return null; // Disabled/unverified accounts cannot log in (matches Spring Boot behavior)
    }

    return user;
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByApiKey(apiKey: string): Promise<User | null> {
    if (!apiKey) return null;
    return this.userRepository.findOne({ where: { apiKey } });
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    if (!token) return null;
    return this.userRepository.findOne({ where: { verificationToken: token } });
  }

  generateApiKey(): string {
    return randomUUID().replace(/-/g, '');
  }

  generateVerificationToken(): string {
    return (
      randomUUID().replace(/-/g, '') + randomUUID().replace(/-/g, '')
    );
  }

  async register(registerDto: RegisterDto): Promise<{ success: boolean; error?: string }> {
    if (registerDto.password !== registerDto.confirmPassword) {
      return { success: false, error: 'Password and Confirm Password must match' };
    }

    const existingUser = await this.findByUsername(registerDto.username);
    if (existingUser) {
      return { success: false, error: 'Username already exists' };
    }

    const existingEmail = await this.findByEmail(registerDto.email);
    if (existingEmail) {
      return { success: false, error: 'Email already exists' };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    const user = new User();
    user.username = registerDto.username;
    user.email = registerDto.email;
    user.password = hashedPassword;
    user.apiKey = this.generateApiKey();
    user.verificationToken = this.generateVerificationToken();
    user.enabled = false;
    user.joinDate = new Date().toISOString().split('T')[0];

    await this.userRepository.save(user);

    await this.emailService.sendVerificationEmail(user.email, user.verificationToken);

    return { success: true };
  }

  async verifyUser(token: string): Promise<boolean> {
    if (!token) return false;
    const user = await this.findByVerificationToken(token);
    if (user) {
      user.enabled = true;
      user.verificationToken = null;
      await this.userRepository.save(user);
      return true;
    }
    return false;
  }

  async updateVerificationToken(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (user) {
      if (user.enabled) {
        return false;
      }
      user.verificationToken = this.generateVerificationToken();
      await this.userRepository.save(user);
      await this.emailService.sendVerificationEmail(user.email, user.verificationToken);
      return true;
    }
    return false;
  }

  async updateUsername(user: User, newUsername: string): Promise<User> {
    const existing = await this.findByUsername(newUsername);
    if (existing && existing.id !== user.id) {
      throw new BadRequestException('Username already exists');
    }
    user.username = newUsername;
    return this.userRepository.save(user);
  }

  async updatePassword(
    user: User,
    oldPass: string,
    newPass: string,
    confirmPass: string,
  ): Promise<void> {
    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    if (newPass !== confirmPass) {
      throw new BadRequestException('New Password and Confirm Password must match');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPass, salt);
    await this.userRepository.save(user);
  }

  async updateApiKey(user: User): Promise<string> {
    user.apiKey = this.generateApiKey();
    await this.userRepository.save(user);
    return user.apiKey;
  }
}
