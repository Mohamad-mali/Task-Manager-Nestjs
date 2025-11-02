import { Test, TestingModule } from '@nestjs/testing';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import * as brypt from 'bcrypt';

import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  flatten,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  let users: User[] = [];

  let FakeUserRepo: DeepPartial<Repository<User>> = {
    find: () => {
      return Promise.resolve(users);
    },
    findOne: async (options: any) => {
      const key = Object.keys(options.where);
      const user = await users.filter(
        (user) => user[key[0]] === options.where[key[0]],
      );

      // console.log(user);
      let res;

      if (user.length) {
        res = user[0];
      } else {
        res = undefined;
      }

      return Promise.resolve(res);
    },
    create: (data: Partial<User>) => {
      const id = Math.ceil(Math.random() * 9999);
      const key = 'id';
      const user = { ...data } as User;
      user[key] = id.toString();
      return user as User;
    },
    save: async (user: User) => {
      users.push(user);
      return Promise.resolve(user);
    },
    remove: async (user: User) => {
      users = users.filter((obj) => obj.id !== user.id);
      return Promise.resolve();
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: FakeUserRepo,
        },
      ],
    }).compile();

    service = module.get(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const hashPass = await brypt.hash('password', 12);

    const user = await service.createUser('tst@tst.com', hashPass, 'tester');

    expect(user).toBeDefined();
    expect(user).toEqual(users[0]);
  });

  it('Should throw an error and not create the new user', async () => {
    const hashPass = await brypt.hash('password', 12);
    await service.createUser('tst2@tst.com', hashPass, 'tester');

    await expect(
      service.createUser('tst2@tst.com', hashPass, 'tester'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should NOT login', async () => {
    const hashPass = await brypt.hash('password', 12);
    await service.createUser('tst3@tst.com', hashPass, 'tester');

    await expect(service.loging('tst3@tst.com', 'password1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should login', async () => {
    const hashPass = await brypt.hash('password', 12);
    await service.createUser('tst4@tst.com', hashPass, 'tester');

    await expect(service.loging('tst4@tst.com', 'password')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should not login due to email not being found', async () => {
    await expect(service.loging('tst5@tst.com', 'password')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('it should delete a user with given id', async () => {
    const hashPass = await brypt.hash('password', 12);
    await service.createUser('tst6@tst.com', hashPass, 'tester');

    let user1: any = await users.filter(
      (user) => user.email === 'tst6@tst.com',
    );

    await service.deleteUser(user1[0].id);

    user1 = await users.filter((user) => user.email === 'tst6@tst.com');
    expect(user1).toEqual([]);
  });

  it('it should update an user with given id', async () => {
    const hashPass = await brypt.hash('password', 12);
    await service.createUser('tst7@tst.com', hashPass, 'tester');

    const user1: any = await users.filter(
      (user) => user.email === 'tst7@tst.com',
    );

    expect(user1[0].email).toEqual('tst7@tst.com');

    await service.updateUser(user1[0].id, { email: 'tst8@tst.com' });

    expect(user1[0].email).toEqual('tst8@tst.com');
  });
});
