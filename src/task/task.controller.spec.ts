import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { DeepPartial } from 'typeorm';

//Internal imports
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { Task } from './task.entity';
import { CreateTask } from './DTO/createTask.DTO';
import { UpdateTaskDto } from './DTO/updateTask.DTO';

describe('TaskController', () => {
  let controller: TaskController;

  let users: DeepPartial<User[]> = [
    { id: '1', email: 'tst', userName: 'username', password: '111111' },
  ];

  let FakeTaskServices: DeepPartial<TaskService> = {
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
      return Promise.resolve({
        id: '3',
        title: data.title,
        description: data.description,
        status: data.status,
        owner: users[0],
        assign: users[0],
      } as DeepPartial<Task>);
    },
    deleteTask: (id) => {
      return Promise.resolve(true);
    },
    updateTask: (id) => {
      return Promise.resolve('updated');
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
        JwtService,
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
    };
    const task = await controller.createTask('tst', data);

    expect(task).toBeDefined();
  });

  it('should return a list of task', async () => {
    const tasks = await controller.getAllTask(1, 10);
    expect(tasks).toBeDefined();
  });

  it('should delete a task', async () => {
    const res = await controller.deleteTask('1');

    expect(res).toBe(true);
  });

  it('should update a task', async () => {
    const data: UpdateTaskDto = {
      title: 'tst',
      description: 'tst',
      assign: '',
      status: 0,
    };
    const res = await controller.updateTask('1', data, '1');

    expect(res).toBe('updated');
  });
});
