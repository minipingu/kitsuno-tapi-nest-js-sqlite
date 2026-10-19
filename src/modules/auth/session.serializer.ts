import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../../entities/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: User, done: (err: Error | null, user: number) => void): void {
    done(null, user.id);
  }

  async deserializeUser(
    userId: number,
    done: (err: Error | null, payload: User | null) => void,
  ): Promise<void> {
    try {
      const user = await this.authService.findById(userId);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
}
