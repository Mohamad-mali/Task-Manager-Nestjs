import { IsEmail, IsOptional, Length } from 'class-validator';

export class updateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  userName: string;

  @IsOptional()
  @Length(8, 30)
  oldPassword: string;

  @IsOptional()
  @Length(8, 30)
  newPassword: string;
}
