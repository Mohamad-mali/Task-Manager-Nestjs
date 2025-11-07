import { Test, TestingModule } from '@nestjs/testing';
import { DeepPartial, Repository } from 'typeorm';
import * as brypt from 'bcrypt';

import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

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

  it('should give a list of users', async () => {
    const users = await service.findAll({});

    expect(users).toBeTruthy();
  });

  it('should not find a user by id', async () => {
    await expect(service.findById('123671236812asdas')).rejects.toThrow(
      NotFoundException,
    );
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

  it('Should throw an error and not create the new user', async () => {
    const hashPass = await brypt.hash('password', 12);
    await service.createUser('tst222@tst.com', hashPass, 'tester');

    await expect(
      service.createUser('tstlog2@tst.com', hashPass, 'tester'),
    ).rejects.toThrow(BadRequestException);
  });

  it('Should throw an error and not create the new user', async () => {
    const hashPass = await brypt.hash('password', 12);
    await service.createUser('tst22@tst.com', hashPass, 'tester');

    await expect(
      service.createUser('tst12@tst.com', hashPass, 'console'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should NOT login', async () => {
    const hashPass = await brypt.hash('password', 12);
    await service.createUser('tst3@tst.com', hashPass, 'tester');

    await expect(service.loging('tst3@tst.com', 'password1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should NOT login dude to unvalid email and forbiden words', async () => {
    const hashPass = await brypt.hash('password', 12);
    await service.createUser('tst23@tst.com', hashPass, 'tester');

    await expect(
      service.loging('tstlog23@tst.com', 'password'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should NOT login dude to unvalid password and forbiden words', async () => {
    const hashPass = await brypt.hash('password', 12);
    await service.createUser('tst33@tst.com', hashPass, 'tester');

    await expect(
      service.loging('tst33@tst.com', 'passwordlog'),
    ).rejects.toThrow(BadRequestException);
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

  it('it should delete a user with given id', async () => {
    const hashPass = await brypt.hash('password11', 12);
    await service.createUser('tst16@tst.com', hashPass, 'tester');

    let user1: any = await users.filter(
      (user) => user.email === 'tst16@tst.com',
    );

    await expect(service.deleteUser('dasdasdw12312314')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('it should update an user with given id', async () => {
    const hashPass = await brypt.hash('password', 12);
    await service.createUser('tst7@tst.com', hashPass, 'tester');

    const user1: any = await users.filter(
      (user) => user.email === 'tst7@tst.com',
    );

    expect(user1[0].email).toEqual('tst7@tst.com');

    await service.updateUser(user1[0].id, {
      email: 'tst8@tst.com',
      userName: '',
      newPassword: '',
      oldPassword: '',
    });

    expect(user1[0].email).toEqual('tst8@tst.com');
  });

  it('it shouldnot update an user with given id becuse forbidword in email', async () => {
    const hashPass = await brypt.hash('password', 12);
    await service.createUser('tst17@tst.com', hashPass, 'tester');

    const user1: any = await users.filter(
      (user) => user.email === 'tst17@tst.com',
    );

    expect(user1[0].email).toEqual('tst17@tst.com');

    await expect(
      service.updateUser(user1[0].id, {
        email: 'tstlog8@tst.com',
        userName: '',
        newPassword: '',
        oldPassword: '',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('it shouldnot update an user with given id becuse forbidword in username', async () => {
    const hashPass = await brypt.hash('password', 12);
    await service.createUser('tst27@tst.com', hashPass, 'tester');

    const user1: any = await users.filter(
      (user) => user.email === 'tst27@tst.com',
    );

    expect(user1[0].email).toEqual('tst27@tst.com');

    await expect(
      service.updateUser(user1[0].id, {
        email: '',
        userName: 'log',
        newPassword: '',
        oldPassword: '',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('it shouldnot update an user with given id becuse forbidword in newpassword', async () => {
    const hashPass = await brypt.hash('password', 12);
    await service.createUser('tst37@tst.com', hashPass, 'tester');

    const user1: any = await users.filter(
      (user) => user.email === 'tst37@tst.com',
    );

    expect(user1[0].email).toEqual('tst37@tst.com');

    await expect(
      service.updateUser(user1[0].id, {
        email: '',
        userName: '',
        newPassword: 'console',
        oldPassword: '',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
