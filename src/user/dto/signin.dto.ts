import { IsString, Length } from 'class-validator';

export class LoginUser {
  @IsString()
  email: string;

  @IsString()
  @Length(8, 30)
  password: string;
}
