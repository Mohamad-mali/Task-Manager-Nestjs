import {
  Body,
  Controller,
  UseInterceptors,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CacheTTL } from '@nestjs/cache-manager';
import { plainToInstance } from 'class-transformer';

//internal Imports
import { TaskService } from './task.service';
import { HttpCacheInterceptor } from './interceptors/cacheInterceptor';
import { AuthGuard } from '../auth/auth.guard';

//Custom Types
import type { Pagination } from '../user/types/pagination.type';
import { TaskResponseDto } from './DTO/task.DTO';
import { CreateTask } from './DTO/createTask.DTO';
import { UpdateTaskDto } from './DTO/updateTask.DTO';

@ApiTags('Tasks')
@Controller('task')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  @CacheTTL(300_000)
  @UseInterceptors(HttpCacheInterceptor)
  @ApiOperation({
    summary: 'get a list of the first 10 tasks',
  })
  @ApiQuery({ name: 'page', description: 'page number', example: '1' })
  @ApiQuery({
    name: 'take',
    description: 'number of item per page',
    example: '10',
  })
  @ApiResponse({ status: 200, description: 'list of the tasks' })
  async getAllTask(@Query('page') page?: number, @Query('take') take?: number) {
    const data: Pagination = {
      page,
      take,
    };
    return await this.taskService.findAll(data);
  }

  @Get('deleted')
  @ApiOperation({
    summary: 'get a list of the first 10 Soft deleted tasks',
  })
  @ApiQuery({ name: 'page', description: 'page number', example: '1' })
  @ApiQuery({
    name: 'take',
    description: 'number of item per page',
    example: '10',
  })
  @ApiResponse({ status: 200, description: 'list of the tasks' })
  async getHiddentasks(
    @Query('page') page: number,
    @Query('take') take?: number,
  ) {
    const data: Pagination = {
      page,
      take,
    };
    return await this.taskService.findHidden(data);
  }

  @Post('createTask')
  @ApiOperation({
    summary: 'Create a user',
  })
  @ApiBody({
    description: 'The user data with is used to create the user',
    type: CreateTask,
    examples: {
      valid: {
        summary: 'a valid example',
        value: {
          title: 'First Task',
          description: 'Example Task to check the api',
          status: '0',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: '' })
  async createTask(@Req() req, @Body() data: CreateTask) {
    const task = await this.taskService.createTask(data, req.user);
    return plainToInstance(TaskResponseDto, task, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'find a task with the given ID',
  })
  @ApiParam({
    name: 'id',
    description: 'uniqe id of the task with is a uuid',
    example: 'aaaaaaaa-bbb1-1111-11c1-2222a11112a1',
  })
  async getTaskBy(@Param('id') id: string) {
    const task = await this.taskService.findById(id);
    return plainToInstance(TaskResponseDto, task, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'delete a task with the given ID',
  })
  @ApiParam({
    name: 'id',
    description: 'uniqe id of the task with is a uuid',
    example: 'aaaaaaaa-bbb1-1111-11c1-2222a11112a1',
  })
  async deleteTask(@Param('id') id: string) {
    return await this.taskService.deleteTask(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user with the given ID',
  })
  @ApiParam({
    name: 'id',
    description: 'uniqe id of the user with is a uuid',
    example: 'aaaaaaaa-bbb1-1111-11c1-2222a11112a1',
  })
  @ApiBody({
    description:
      'login info of the user that is already a user at website or app',
    type: UpdateTaskDto,
    examples: {
      valid: {
        summary: 'a valid example',
        value: {
          title: 'updated tasak',
          description: 'updated task description',
          status: '1',
          assign: 'aaaaaaaa-bbb1-1111-11c1-2222a11112a1',
        },
      },
    },
  })
  async updateTask(
    @Req() req,
    @Body() body: UpdateTaskDto,
    @Param('id') id: string,
  ) {
    return await this.taskService.updateTask(id, body, req.user.sub);
  }
}
