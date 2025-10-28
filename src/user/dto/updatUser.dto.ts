import { IsEmail, IsOptional } from 'class-validator';

export class updateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  oldPassword: string;

  @IsOptional()
  newPassword: string;
}
