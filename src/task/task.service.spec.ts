import { Test, TestingModule } from '@nestjs/testing';
import { DeepPartial, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { Task } from './task.entity';
import { TaskService } from './task.service';
import { User } from '../user/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

describe('TaskService', () => {
  let service: TaskService;

  let users: DeepPartial<User[]> = [
    { email: 'tst@tst.com', password: '123456789', id: '1' },
    { email: 'tst@tst.com', password: '123456789', id: '2' },
  ];

  let tasks: DeepPartial<Task[]> = [
    {
      title: 'Task 1',
      description: 'this is a test task',
      hidden: false,
      assign: 'none',
      id: '1',
      status: 0,
      userId: '1',
    },
    {
      title: 'Task 2',
      description: 'this is a test task',
      hidden: false,
      assign: 'none',
      id: '2',
      status: 0,
      userId: '1',
    },
    {
      title: 'Task 3',
      description: 'this is a test task',
      hidden: false,
      assign: 'none',
      id: '3',
      status: 0,
      userId: '2',
    },
    {
      title: 'Task 4',
      description: 'this is a test task',
      hidden: false,
      assign: 'none',
      id: '4',
      status: 0,
      userId: '2',
    },
    {
      title: 'Task 5',
      description: 'this is a test task',
      hidden: true,
      assign: 'none',
      id: '5',
      status: 0,
      userId: '2',
    },
  ];

  let FakeTaskRepo: DeepPartial<Repository<Task>> = {
    find: async () => {
      const taskList = await tasks.filter((task) => task.hidden !== true);
      return Promise.resolve(taskList);
    },
    findOne: async (options: any) => {
      const key = Object.keys(options.where);
      const task = await tasks.filter(
        (task) => task[key[0]] === options.where[key[0]],
      );

      let res;

      if (task.length) {
        res = task[0];
      } else {
        res = undefined;
      }

      return Promise.resolve(res);
    },
    create: (data: Partial<Task>) => {
      const id = Math.ceil(Math.random() * 9999);
      const key = 'id';
      const task = { ...data } as Task;
      task[key] = id.toString();
      return task as Task;
    },
    save: async (task: Task) => {
      tasks.push(task);
      return Promise.resolve(task);
    },
    remove: async (task: Task) => {
      tasks = tasks.filter((obj) => obj.id !== task.id);
      return Promise.resolve();
    },
  };

  let FakeUserService: DeepPartial<UserService> = {
    findById: (id) => {
      return Promise.resolve(users[0]);
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: FakeTaskRepo,
        },
        {
          provide: CACHE_MANAGER,
          useValue: 'none',
        },
        {
          provide: UserService,
          useValue: FakeUserService,
        },
        { provide: JwtService, useValue: '' },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list of tasks', async () => {
    const taskList = await service.findAll();

    expect(taskList).toBeDefined();
  });

  it('should return a list of deleted tasks', async () => {
    const delTask = await service.findHidden();

    expect(delTask).toBeDefined();
  });

  it('should retunr a task by the id', async () => {
    const idTask = await service.findById('2');

    expect(idTask).toBeDefined();
  });

  it('should create a task', async () => {
    const data = {
      title: 'Task 8',
      description: 'this is a test task',
      hidden: true,
      assign: 'none',
      id: '8',
      status: 0,
      userId: '2',
    };
    const task = await service.createTask(data);

    expect(task).toBeDefined();
  });

  it('should soft delete a task', async () => {
    const deletedTask = await service.deleteTask('5');

    expect(tasks).toContain(deletedTask);
    expect(deletedTask.hidden).toBe(true);
  });

  it('should update the task', async () => {
    const upTask = await service.updateTask('3', {
      title: 'tested',
      assign: '',
      description: '',
      status: 0,
    });

    expect(upTask).toBeDefined();
  });
});
