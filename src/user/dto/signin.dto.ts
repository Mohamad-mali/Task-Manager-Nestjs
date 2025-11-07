import { IsString, Length, Matches } from 'class-validator';

export class LoginUser {
  @IsString()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  email: string;

  @IsString()
  @Length(8, 30)
  @Matches(/^[A-Za-z0-9]+$/)
  password: string;
}
