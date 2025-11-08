import { Expose, Type } from 'class-transformer';

export class AssignUserResponseDto {
  @Expose()
  id: string;
}

export class TaskResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  status: number;

  @Expose()
  deletedAt: Date | null;

  @Expose()
  @Type(() => AssignUserResponseDto)
  assign: AssignUserResponseDto;
}
