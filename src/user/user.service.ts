import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as brypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

//internal Imports
import { User } from './user.entity';
import { Task } from '../task/task.entity';

@Injectable()
export class UserService {
  private readonly slat: 'superlongS@ltTHATiAMgonaaForgotINNOBLODDYTIMem@te';

  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    private jwtservice: JwtService,
  ) {}

  async findAll() {
    return await this.repo.find();
  }

  async findById(id: string) {
    return await this.repo.findOne({ where: { id: id } });
  }

  async createUser(email: string, password: string, userName: string) {
    const isUser = await this.repo.findOne({ where: { email: email } });

    if (isUser) {
      throw new BadRequestException();
    }

    const hashPass = await brypt.hash(password, 12);

    const user = this.repo.create({
      email,
      password: hashPass,
      userName,
    });

    return await this.repo.save(user);
  }

  async loging(userName: string, password: string) {
    const user = await this.repo.findOne({ where: { userName: userName } });

    if (!user) {
      throw new NotFoundException();
    }
    const isPass = brypt.compare(password, user.password);

    if (!isPass) {
      throw new BadRequestException();
    }

    const payload = { sub: user.id, userName: user.userName };

    return { access_token: await this.jwtservice.signAsync(payload) };
  }

  async deleteUser(id: string) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    const tasks = await this.taskRepo.find({ where: { userId: user.id } });

    if (tasks) {
      this.taskRepo.remove(tasks);
    }

    return await this.repo.remove(user);
  }

  async updateUser(id: string, atters: Partial<User>) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    Object.assign(user, atters);
    return await this.repo.save(user);
  }
}
