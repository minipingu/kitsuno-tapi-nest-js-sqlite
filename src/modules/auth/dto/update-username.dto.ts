import { IsNotEmpty, Length, Matches } from 'class-validator';

export class UpdateUsernameDto {
  @IsNotEmpty({ message: 'New Username is required' })
  @Length(5, 14, { message: 'New Username must be between 5 and 14 characters' })
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'New Username can only contain alphanumeric characters' })
  newUsername: string;
}
