import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Task } from '../task/task.entity';
import { User } from './user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, Task, User],
    }).compile();

    controller = module.get(UserController);
    service = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should Show all users in arry', async () => {
      const result: [
        { id: string; userName: string; email: string; password: string },
      ] = [
        {
          id: 'sajdlsjdlkas',
          userName: 'adsdasdas',
          email: 'asdasdas',
          password: ' asdasdasd ',
        },
      ];

      let res: [] = [];

      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve(res));

      expect(await controller.userList()).toBe(res);
    });
  });
});
