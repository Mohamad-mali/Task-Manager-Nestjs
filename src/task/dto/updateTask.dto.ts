import { IsOptional, Length, Max, Min } from 'class-validator';

import { Status } from './TaskStatus';

export class updateTaskDto {
  @IsOptional()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  @Min(1)
  @Max(3)
  status: Status;
}
