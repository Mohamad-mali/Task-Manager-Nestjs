import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Status } from '../types/TaskStatus';

export class CreateTask {
  @ApiProperty({ description: 'title', example: 'build a snow man!' })
  @IsString()
  @Length(3, 30)
  title: string;

  @ApiProperty({
    description: 'description',
    example: 'build a snow man! after snow strom, with carrot for nose',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'status of the task', example: 'TO_DO' })
  @IsNumber()
  status: Status;
}
