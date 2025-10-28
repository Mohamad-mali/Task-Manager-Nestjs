import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';

//internal Imports
import { Task } from './task.entity';
import { CreateTask } from './dto/createTask.dto';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(@InjectRepository(Task) private repo: Repository<Task>) {}

  @Cron('* */10 * * * *')
  async scheduler() {
    const pending = await this.repo.find({ where: { status: 1 } });
    const inProgress = await this.repo.find({ where: { status: 2 } });

    for (const task of pending) {
      task.status = 2;
      await this.repo.save(task);
    }

    for (const task of inProgress) {
      task.status = 1;
      await this.repo.save(task);
    }
  }

  async findAll() {
    return await this.repo.find();
  }

  async findById(id: string) {
    return await this.repo.findOne({ where: { id: id } });
  }

  async createTask(data) {
    const task = this.repo.create(data);

    return await this.repo.save(task);
  }

  async deleteTask(id: string) {
    const task = await this.findById(id);

    if (!task) {
      this.logger.error(
        'the task was not found, or the task id was wrong (taask deletion faild)',
      );
      throw new BadRequestException();
    }

    return await this.repo.remove(task);
  }

  async updateTask(id: string, atters: Partial<Task>) {
    const task = await this.findById(id);

    if (!task) {
      this.logger.error(
        'the task was not found, or the task id was wrong (taask update faild)',
      );
      throw new BadRequestException();
    }
    this.logger.warn('task was updated!!! the data is ereasable');
    Object.assign(task, atters);
    return await this.repo.save(task);
  }
}
