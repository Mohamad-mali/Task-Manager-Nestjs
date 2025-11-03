import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { DeepPartial } from 'typeorm';

describe('UserController', () => {
  let controller: UserController;

  let users: User[] = [
    { email: 'tst@tst.com', password: 'hashedpass' } as User,
    { email: 'tst1@tst.com', password: 'hashedpass1' } as User,
  ];

  let FakeUserService: DeepPartial<UserService> = {
    findAll: () => {
      return Promise.resolve(users);
    },
    loging: (email: string, password: string) => {
      return Promise.resolve({ access_token: 'the token' });
    },
    createUser: (email: string, password: string, userName: string) => {
      return Promise.resolve({ email, password, userName } as User);
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: FakeUserService,
        },
        JwtService,
      ],
    }).compile();

    controller = module.get(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should give an arry of users', async () => {
    const users = await controller.userList();

    console.log(users);
    expect(users.length).toEqual(2);
    expect(users[1].email).toEqual('tst1@tst.com');
  });

  it('should give me the access token', async () => {
    const { access_token } = await controller.loginUser({
      email: 'tst@tst.com',
      password: 'hashedpass',
    });
    expect(access_token).toEqual('the token');
  });

  it('should return a user instance', async () => {
    const body = {
      email: 'tst2@tst.com',
      password: 'hashedpass',
      userName: 'tster',
    };
    const user = await controller.createUser(body);

    expect(user).toBeDefined();
    expect(user).toEqual(body);
  });
});
