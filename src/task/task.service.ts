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
import { Repository } from 'typeorm';

//internal Imports
import { Task } from './task.entity';
import { UserService } from '../user/user.service';

//Custom Types
import { Status } from './types/TaskStatus';
import type { Pagination } from './types/pagination.type';
import { CreateTask } from './DTO/createTask.DTO';
import { updateTaskDto } from './DTO/updateTask.DTO';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

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
      where: { status: Status.PENDDING, hidden: false },
    });

    for (const task of pending) {
      task.status = Status.IN_PRPGRESS;
      await this.repo.save(task);
    }
  }

  @Cron('* * 12 * * *')
  async cleanTask() {
    const hiddenTasks = await this.repo.find({ where: { hidden: true } });

    return await this.repo.remove(hiddenTasks);
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
        where: { hidden: false },
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
        where: { hidden: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `ops!! couldn't fetch task, please try again leter!`,
      );
    }
  }

  async findById(id: string) {
    try {
      return await this.repo.findOne({ where: { id: id } });
    } catch (error) {
      throw new InternalServerErrorException(
        `internal Error, faild to find the task by id!!`,
      );
    }
  }

  async createTask(data: CreateTask) {
    const user = await this.userService.findById(data.userId);

    if (
      this.forbidenWord.some((word) =>
        data.title.toLowerCase().includes(word.toLowerCase()),
      )
    ) {
      throw new BadRequestException(
        'enter a valid email, dont include forbiden words!!!',
      );
    }
    if (
      this.forbidenWord.some((word) =>
        data.description.toLowerCase().includes(word.toLowerCase()),
      )
    ) {
      throw new BadRequestException(
        'enter a valid email, dont include forbiden words!!!',
      );
    }

    if (!user) {
      this.logger.error(
        'there was no user found or the id was wrong(task creation faild)',
      );
      throw new BadRequestException(
        'there was no user found or the id was wrong(task creation faild)',
      );
    }

    const { userId, ...taskinfo } = data;
    const task = { ...taskinfo, user: user };
    const taskIntence = await this.repo.create(task);
    try {
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
      task.hidden = true;

      await this.chacheMan.del('all-tasks');

      return await this.repo.save(task);
    } catch (error) {
      throw new InternalServerErrorException(
        'something or somethings may have been went wrong. thus we were unable to delete the task',
      );
    }
  }

  async updateTask(id: string, atters: updateTaskDto) {
    const task = await this.findById(id);

    // let user = await this.findById(atters.assign);
    // there is this bug we need user repo to find user

    if (
      this.forbidenWord.some((word) =>
        atters.title.toLowerCase().includes(word.toLowerCase()),
      )
    ) {
      throw new BadRequestException(
        'enter a valid email, dont include forbiden words!!!',
      );
    }
    if (
      this.forbidenWord.some((word) =>
        atters.description.toLowerCase().includes(word.toLowerCase()),
      )
    ) {
      throw new BadRequestException(
        'enter a valid email, dont include forbiden words!!!',
      );
    }

    // if (!user) {
    //   throw new NotFoundException(
    //     `could find user that you are tryign to assign the task to!!!!!`,
    //   );
    // }

    if (!task) {
      this.logger.error(
        'the task was not found, or the task id was wrong (taask update faild)',
      );
      throw new BadRequestException();
    }
    try {
      const updatedTask: Partial<Task> = {
        title: atters.title,
        description: atters.description,
        status: atters.status,
        assign: atters.assign,
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
