import { IsEmail, IsOptional, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'user E-mail', example: 'Test@example.com' })
  @IsEmail()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  @IsOptional()
  email: string;

  @ApiProperty({ description: 'user Username', example: 'tester' })
  @IsOptional()
  @Matches(/^[A-Za-z0-9]+$/)
  userName: string;

  @ApiProperty({ description: 'user Old Password', example: '12345678' })
  @IsOptional()
  @Matches(/^[A-Za-z0-9]+$/)
  @Length(8, 30)
  oldPassword: string;

  @ApiProperty({ description: 'user New Password', example: '87654321' })
  @IsOptional()
  @Matches(/^[A-Za-z0-9]+$/)
  @Length(8, 30)
  newPassword: string;
}
