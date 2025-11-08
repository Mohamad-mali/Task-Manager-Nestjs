import {
  BadRequestException,
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { IsNull, Not, Repository } from 'typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

//internal Imports
import { Task } from './task.entity';
import { UserService } from '../user/user.service';

//Custom Types
import { Status } from './types/TaskStatus';
import type { Pagination } from './types/pagination.type';
import { CreateTask } from './DTO/createTask.DTO';
import { UpdateTaskDto } from './DTO/updateTask.DTO';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(
    @InjectRepository(Task) private repo: Repository<Task>,
    @Inject(CACHE_MANAGER) private chacheMan: Cache,
    private userService: UserService,
  ) {}

  private forbidenWord = [
    'root',
    'user',
    'scripts',
    'script',
    'console',
    'log',
    'admin',
    'host',
    'get',
    '<>',
    `'`,
    `"`,
    ':',
    `()`,
    '(',
    ')',
    '<',
    '>',
  ];

  @Cron('* */10 * * * *')
  async scheduler() {
    const pending = await this.repo.find({
      where: { status: Status.PENDDING },
    });

    for (const task of pending) {
      task.status = Status.IN_PRPGRESS;
      await this.repo.save(task);
    }
  }

  @Cron('* * 12 * * *')
  async cleanTask() {
    const softDeletedTask = await this.repo.find({
      where: { deletedAt: Not(IsNull()) },
    });

    return await this.repo.remove(softDeletedTask);
  }

  async findAll(data?: Pagination) {
    let take: number;
    let skip: number;

    if (data) {
      take = data.take || 10;
      skip = ((data.page || 1) - 1) * take;
    } else {
      take = 10;
      skip = 0;
    }

    try {
      return await this.repo.find({
        take: take,
        skip: skip,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `ops!! couldn't fetch task, please try again leter!`,
      );
    }
  }

  async findHidden(data?: Pagination) {
    let take: number;
    let skip: number;

    if (data) {
      take = data.take || 10;
      skip = ((data.page || 1) - 1) * take;
    } else {
      take = 10;
      skip = 0;
    }
    try {
      return await this.repo.find({
        take: take,
        skip: skip,
        where: { deletedAt: Not(IsNull()) },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `ops!! couldn't fetch task, please try again leter!`,
      );
    }
  }

  async findById(id: string) {
    try {
      return await this.repo.findOne({
        where: { id: id },
        relations: ['owner', 'assign'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `internal Error, faild to find the task by id!!`,
      );
    }
  }

  async createTask(data: CreateTask, user) {
    if (!data) {
      throw new BadRequestException('no Data was given!');
    }

    const owner = await this.userService.findById(user.sub);

    if (!owner) {
      this.logger.error(
        'there was no user found or the id was wrong(task creation faild)',
      );
      throw new BadRequestException(
        'there was no user found or the id was wrong(task creation faild)',
      );
    }

    if (
      data.title &&
      this.forbidenWord.some((word) =>
        data.title.toLowerCase().includes(word.toLowerCase()),
      )
    ) {
      throw new BadRequestException(
        'enter a valid email, dont include forbiden words!!!',
      );
    }
    if (
      data.description &&
      this.forbidenWord.some((word) =>
        data.description.toLowerCase().includes(word.toLowerCase()),
      )
    ) {
      throw new BadRequestException(
        'enter a valid email, dont include forbiden words!!!',
      );
    }

    const task = { ...data, owner: owner, assign: owner };
    const taskIntence = await this.repo.create(task);
    try {
      await this.chacheMan.del('all-tasks');
      return await this.repo.save(taskIntence);
    } catch (error) {
      throw new InternalServerErrorException(
        'faild to create the task, please try agian leter',
      );
    }
  }

  async deleteTask(id: string) {
    const task = await this.findById(id);

    if (!task) {
      this.logger.error(
        'the task was not found, or the task id was wrong (taask deletion faild)',
      );
      throw new NotFoundException(
        'Unable to find the task by the given ID, pleas check the ID',
      );
    }
    try {
      await this.chacheMan.del('all-tasks');

      return await this.repo.softDelete(task);
    } catch (error) {
      throw new InternalServerErrorException(
        'something or somethings may have been went wrong. thus we were unable to delete the task',
      );
    }
  }

  async updateTask(id: string, atters: UpdateTaskDto, userId: string) {
    if (!atters) {
      throw new BadRequestException('no Data was given!');
    }

    const ownerUser = await this.userService.findById(userId);

    const task = await this.findById(id);

    if (!ownerUser) {
      throw new BadRequestException(`couldn't find the Owner User!!!`);
    }

    if (!task) {
      this.logger.error(
        'the task was not found, or the task id was wrong (taask update faild)',
      );
      throw new BadRequestException();
    }

    if (ownerUser === task?.owner) {
      throw new BadRequestException(`the user isnt the owner of the task!!!!`);
    }

    if (
      atters.title &&
      this.forbidenWord.some((word) =>
        atters.title.toLowerCase().includes(word.toLowerCase()),
      )
    ) {
      throw new BadRequestException(
        'enter a valid email, dont include forbiden words!!!',
      );
    }
    if (
      atters.description &&
      this.forbidenWord.some((word) =>
        atters.description.toLowerCase().includes(word.toLowerCase()),
      )
    ) {
      throw new BadRequestException(
        'enter a valid email, dont include forbiden words!!!',
      );
    }

    if (
      atters.assign &&
      this.forbidenWord.some((word) =>
        atters.assign.toLowerCase().includes(word.toLowerCase()),
      )
    ) {
      throw new BadRequestException(
        'enter a valid assigning id, dont include forbiden words!!!',
      );
    }

    let assignUser;

    if (atters.assign) {
      assignUser = await this.userService.findById(atters.assign);
      if (!assignUser) {
        throw new NotFoundException(
          `could find assignUser that you are tryign to assign the task to!!!!!`,
        );
      }
    }

    try {
      const updatedTask: Partial<Task> = {
        title: atters.title,
        description: atters.description,
        status: atters.status,
        assign: assignUser,
      };

      this.logger.warn('task was updated!!! the data is ereasable');
      Object.assign(task, updatedTask);

      const tsk = await this.repo.save(task);

      await this.chacheMan.del('all-tasks');

      return tsk;
    } catch (error) {
      throw new InternalServerErrorException(
        `updating the task went wrong, please try again leter.`,
      );
    }
  }
}
