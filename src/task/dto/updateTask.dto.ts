import { IsOptional, IsUUID, Length, Max, Min } from 'class-validator';

import { Status } from './TaskStatus';

export class updateTaskDto {
  @IsOptional()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  @IsUUID()
  assign: string;

  @IsOptional()
  status: Status;
}
