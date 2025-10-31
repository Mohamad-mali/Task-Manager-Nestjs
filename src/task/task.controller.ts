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
  InternalServerErrorException,
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
    try {
      return this.taskService.findById(id);
    } catch (error) {
      throw new InternalServerErrorException('something went wrong!');
    }
  }

  @Get()
  @CacheKey('all-tasks')
  @CacheTTL(300_000)
  async getAllTask() {
    try {
      return await this.taskService.findAll();
    } catch (err) {
      throw new InternalServerErrorException('something went wrong!');
    }
  }

  @Post('/createTask')
  async createTask(@Body() data: CreateTask) {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException('something went wrong!');
    }
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
    try {
      return this.taskService.deleteTask(id);
    } catch (error) {
      throw new InternalServerErrorException('something went wrong!');
    }
  }

  @Patch('/:id')
  updateTask(@Body() body: updateTaskDto, @Param('id') id: string) {
    try {
      return this.taskService.updateTask(id, body);
    } catch (error) {
      throw new InternalServerErrorException('something went wrong!');
    }
  }
}
