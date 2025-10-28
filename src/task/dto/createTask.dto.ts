import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateTask {
  @IsString()
  @Length(3, 30)
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  status: number;

  @IsString()
  userId: string;
}
