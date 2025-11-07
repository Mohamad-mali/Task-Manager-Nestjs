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
  UseGuards,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

//internal Imports
import { TaskService } from './task.service';
import { AuthGuard } from '../auth/auth.guard';

//Custom Types
import type { Pagination } from '../user/types/pagination.type';
import { CreateTask } from './DTO/createTask.DTO';
import { updateTaskDto } from './DTO/updateTask.DTO';

@Controller('task')
@UseGuards(AuthGuard)
@UseInterceptors(CacheInterceptor)
export class TaskController {
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

  @Get('deleted')
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
  async createTask(@Body() data: CreateTask) {
    return await this.taskService.createTask(data);
  }

  @Get(':id')
  async getTaskBy(@Param('id') id: string) {
    return await this.taskService.findById(id);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return await this.taskService.deleteTask(id);
  }

  @Patch(':id')
  async updateTask(@Body() body: updateTaskDto, @Param('id') id: string) {
    return await this.taskService.updateTask(id, body);
  }
}
