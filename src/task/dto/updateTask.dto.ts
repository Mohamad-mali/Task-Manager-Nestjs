import { IsOptional, IsUUID, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Status } from '../types/TaskStatus';

export class UpdateTaskDto {
  @ApiProperty({ description: 'title', example: 'build a snow man!' })
  @IsOptional()
  @Matches(/^[A-Za-z0-9]+$/)
  title: string;

  @ApiProperty({
    description: 'description',
    example: 'build a snow man! after snow strom, with carrot for nose',
  })
  @IsOptional()
  @Matches(/^[A-Za-z0-9]+$/)
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
