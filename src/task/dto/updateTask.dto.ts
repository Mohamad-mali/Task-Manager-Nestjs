import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Status } from '../types/TaskStatus';

export class UpdateTaskDto {
  @ApiProperty({ description: 'title', example: 'build a snow man!' })
  @IsOptional()
  title: string;

  @ApiProperty({
    description: 'description',
    example: 'build a snow man! after snow strom, with carrot for nose',
  })
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'assign, the one who has to do the task',
    example: 'aaaaaaaa-bbb1-1111-11c1-2222a11112a1',
  })
  @IsOptional()
  @IsUUID()
  assign: string;

  @ApiProperty({ description: 'status of the task', example: 'TO_DO' })
  @IsOptional()
  status: Status;
}
