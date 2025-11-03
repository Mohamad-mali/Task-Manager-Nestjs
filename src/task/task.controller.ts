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
  Logger,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

//internal Imports
import { CreateTask } from './dto/createTask.dto';
import { updateTaskDto } from './dto/updateTask.dto';
import { TaskService } from './task.service';

//Custom Types
import type { Pagination } from '../Types/pagination.type';

@Controller('task')
@UseInterceptors(CacheInterceptor)
export class TaskController {
  private readonly logger = new Logger(TaskService.name);

  constructor(private taskService: TaskService) {}

  @Get()
  @CacheKey('all-tasks')
  @CacheTTL(300_000)
  async getAllTask(@Query('page') page: number, @Query('take') take?: number) {
    const data: Pagination = {
      page,
      take,
    };
    return await this.taskService.findAll(data);
  }

  @Get('/deleted')
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

  @Post('/createTask')
  async createTask(@Body() data: CreateTask) {
    return await this.taskService.createTask(data);
  }

  @Get('/:id')
  async getTaskBy(@Param('id') id: string) {
    return await this.taskService.findById(id);
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string) {
    return await this.taskService.deleteTask(id);
  }

  @Patch('/:id')
  async updateTask(@Body() body: updateTaskDto, @Param('id') id: string) {
    return await this.taskService.updateTask(id, body);
  }
}
