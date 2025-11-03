import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as brypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

//internal Imports
import { User } from './user.entity';

//Custom Types
import type { Pagination } from '../Types/pagination.type';
import { updateUserDto } from './dto/updatUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private jwtservice: JwtService,
  ) {}

  private async checkPassword(password: string, user: User) {
    return await brypt.compare(password, user.password);
  }

  async findAll(data: Pagination) {
    const take = data.take || 10;
    const skip = ((data.page || 1) - 1) * take;

    try {
      return await this.repo.find({ take: take, skip: skip });
    } catch (error) {
      throw new InternalServerErrorException(
        `ops somthing went wrong, unable to fetch users`,
      );
    }
  }

  async findById(id: string) {
    try {
      return await this.repo.findOne({ where: { id: id } });
    } catch (error) {
      throw new InternalServerErrorException(
        `sound like we were unable to fetch the user by id. please try again leter.`,
      );
    }
  }

  async createUser(email: string, password: string, userName: string) {
    const isUser = await this.repo.findOne({ where: { email: email } });

    if (isUser) {
      throw new BadRequestException(
        'this email is already in use!! Try a diffrent email or go to the sign in!',
      );
    }
    try {
      const hashPass = await brypt.hash(password, 12);

      const user = this.repo.create({
        email,
        password: hashPass,
        userName,
      });

      return await this.repo.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        'something went wrong in the procces of creating a new user. Try again leter!',
      );
    }
  }

  async loging(email: string, password: string) {
    const user = await this.repo.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('Email NOt found in our Database!!!');
    }
    const isPass = await this.checkPassword(password, user);

    if (!isPass) {
      throw new BadRequestException(
        'Wrong Password, please enter the valid Password',
      );
    }
    try {
      const payload = { sub: user.id, userName: user.userName };

      return { access_token: await this.jwtservice.signAsync(payload) };
    } catch (error) {
      throw new InternalServerErrorException(
        'something went wrong, thus we cannot sign you in!!!',
      );
    }
  }

  async deleteUser(id: string) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(
        `could not find the user with the given id!!!`,
      );
    }
    try {
      return await this.repo.remove(user);
    } catch (error) {
      throw new InternalServerErrorException(
        'something went wrong, could delete the user',
      );
    }
  }

  async updateUser(id: string, atters: updateUserDto) {
    let hashPass: string | undefined = undefined;
    const user = await this.findById(id);

    console.log(atters);

    if (!user) {
      throw new NotFoundException(
        'could NOt find the user to update! please check the id!!',
      );
    }

    if (atters.newPassword) {
      if (!atters.oldPassword) {
        throw new BadRequestException(
          `can't change the Password withput giving the old password!!!`,
        );
      }
    }

    if (atters.newPassword && atters.oldPassword) {
      const isPass = this.checkPassword(atters.oldPassword, user);
      if (!isPass) {
        throw new BadRequestException(
          `oldPassword fild does't match with the your current password!!!`,
        );
      }
      hashPass = await brypt.hash(atters.newPassword, 12);
    }

    try {
      const newUser: Partial<User> = {
        email: atters.email,
        userName: atters.userName,
        password: hashPass,
      };
      Object.assign(user, newUser);
      return await this.repo.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        `something went wrong, and could not update the user!!!`,
      );
    }
  }
}
