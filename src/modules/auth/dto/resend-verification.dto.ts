import { IsNotEmpty, Matches } from 'class-validator';

export class ResendVerificationDto {
  @IsNotEmpty({ message: 'Email is required' })
  @Matches(/^[_A-Za-z0-9-+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/, {
    message: 'Email should be valid',
  })
  email: string;
}
