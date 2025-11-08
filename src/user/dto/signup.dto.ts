import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUser {
  @ApiProperty({ description: 'user Username', example: 'tester' })
  @IsString()
  @Matches(/^[A-Za-z0-9]+$/)
  userName: string;

  @ApiProperty({ description: 'user E-mail', example: 'Test@example.com' })
  @IsEmail()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  email: string;

  @ApiProperty({ description: 'user Password', example: '12345678' })
  @IsString()
  @Length(8, 30)
  @Matches(/^[A-Za-z0-9]+$/)
  password: string;
}
