import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Username is required' })
  @Length(5, 14, { message: 'Username must be between 5 and 14 characters' })
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'Username can only contain alphanumeric characters' })
  username: string;

  @IsNotEmpty({ message: 'Email is required' })
  @Matches(/^[_A-Za-z0-9-+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/, {
    message: 'Email should be valid',
  })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 18, { message: 'Password must be between 6 and 18 characters' })
  @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+=.]).*$/, {
    message: 'Password must contain at least one digit, letter, and special character',
  })
  password: string;

  @IsNotEmpty({ message: 'Please Confirm the Password' })
  confirmPassword: string;
}
