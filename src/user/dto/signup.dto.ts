import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUser {
  @IsString()
  userName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(4, 30)
  password: string;
}
