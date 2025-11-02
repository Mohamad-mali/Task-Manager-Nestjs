import { Test, TestingModule } from '@nestjs/testing';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { Task } from './task.entity';
import { CreateTask } from './dto/createTask.dto';

describe('TaskController', () => {
  let controller: TaskController;

  let users: User[] = [];

  let FakeTaskServices: Partial<TaskService> = {
    findById: (id: string) => {
      return Promise.resolve({
        id: '1',
        title: 'tst',
        description: 'description is this',
      } as Task);
    },
    findAll: () => {
      return Promise.resolve([
        { id: '1', title: 'tst', description: 'description is this' },
        { id: '2', title: 'tst2', description: 'description2 is this' },
      ] as Task[]);
    },
    createTask: (data) => {
      return Promise.resolve([
        {
          id: '3',
          title: data.title,
          description: data.description,
          status: data.status,
          userId: data.user.id,
        } as Task,
      ]);
    },
  };

  let FakeUserService: Partial<UserService> = {
    findById: (id: string) => {
      return Promise.resolve({
        id: '1',
        email: 'tst@tst.com',
        password: 'hashedpassword',
      } as User);
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        { provide: CACHE_MANAGER, useValue: '' },
        { provide: UserService, useValue: FakeUserService },
        { provide: TaskService, useValue: FakeTaskServices },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a task', async () => {
    const data: CreateTask = {
      title: 'tst',
      description: 'this a test',
      status: 1,
      userId: '4',
    };
    const task = await controller.createTask(data);
  });

  it('should return a list of task', async () => {
    const tasks = await controller.getAllTask();
  });
});
