import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

import { Status } from './TaskStatus';

export class CreateTask {
  @IsString()
  @Length(3, 30)
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  status: Status;

  @IsString()
  userId: string;
}
