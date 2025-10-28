import { IsString, Length } from 'class-validator';

export class LoginUser {
  @IsString()
  userName: string;

  @IsString()
  @Length(8, 30)
  password: string;
}
