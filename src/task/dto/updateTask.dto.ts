import { IsOptional, Length, Max, Min } from 'class-validator';

export class updateTaskDto {
  @IsOptional()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  @Min(1)
  @Max(3)
  status: number;
}
