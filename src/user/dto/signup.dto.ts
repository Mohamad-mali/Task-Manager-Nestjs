import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateUser {
  @IsString()
  @Matches(/^[A-Za-z0-9]+$/)
  userName: string;

  @IsEmail()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  email: string;

  @IsString()
  @Length(8, 30)
  @Matches(/^[A-Za-z0-9]+$/)
  password: string;
}
