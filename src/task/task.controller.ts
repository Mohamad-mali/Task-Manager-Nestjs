import {
  Body,
  Controller,
  UseInterceptors,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Logger,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
  MessagePattern,
} from '@nestjs/microservices';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { BadRequestException } from '@nestjs/common';

//internal Imports
import { CreateTask } from './dto/createTask.dto';
import { updateTaskDto } from './dto/updateTask.dto';
import { TaskService } from './task.service';
import { UserService } from '../user/user.service';

@Controller('task')
@UseInterceptors(CacheInterceptor)
export class TaskController {
  // private client: ClientProxy;
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private taskService: TaskService,
    private userService: UserService,
  ) {
    // this.client = ClientProxyFactory.create({
    //   transport: Transport.RMQ,
    //   options: {
    //     urls: ['amqp://localhost:5672'],
    //     queue: 'taskQueue',
    //   },
    // });
  }

  @Get('/:id')
  getTaskBy(@Param('id') id: string) {
    return this.taskService.findById(id);
  }

  @Get()
  @CacheKey('all-tasks')
  @CacheTTL(300_000)
  getAllTask() {
    return this.taskService.findAll();
  }

  @Post('/createTask')
  async createTask(@Body() data: CreateTask) {
    const user = await this.userService.findById(data.userId);

    if (!user) {
      this.logger.error(
        'the was no user found or the id was wrong(task creation faild)',
      );
      throw new BadRequestException();
    }

    const { userId, ...taskinfo } = data;
    const task = { ...taskinfo, user: user };
    return await this.taskService.createTask(task);
  }

  // @MessagePattern('createTask')
  // async taskCreate(data: CreateTask) {
  //   const user = await this.userService.findById(data.userId);

  //   if (!user) {
  //     this.logger.error(
  //       'the was no user found or the id was wrong(task creation faild)',
  //     );
  //     throw new BadRequestException();
  //   }
  //   console.log('you got her');

  //   const { userId, ...taskinfo } = data;
  //   const task = { ...taskinfo, user: user };
  //   return await this.taskService.createTask(task);
  // }

  @Delete('/:id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }

  @Patch('/:id')
  updateTask(@Body() body: updateTaskDto, @Param('id') id: string) {
    return this.taskService.updateTask(id, body);
  }
}
