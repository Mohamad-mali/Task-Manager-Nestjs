import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

//internal Imports
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), forwardRef(() => UserModule)],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService, TypeOrmModule],
})
export class TaskModule {}
