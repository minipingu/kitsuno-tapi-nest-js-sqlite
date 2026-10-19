import { IsNotEmpty, Length, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty({ message: 'Old Password is required' })
  oldPassword: string;

  @IsNotEmpty({ message: 'New Password is required' })
  @Length(6, 18, { message: 'New Password must be between 6 and 18 characters' })
  @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+=.]).*$/, {
    message: 'New Password must contain at least one digit, letter, and special character',
  })
  newPassword: string;

  @IsNotEmpty({ message: 'Please Confirm the Password' })
  confirmPassword: string;
}
