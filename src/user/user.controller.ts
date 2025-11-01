import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Logger,
  InternalServerErrorException,
  UseInterceptors,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

//internal Imports
import { CreateUser } from './dto/signup.dto';
import { LoginUser } from './dto/signin.dto';
import { UserService } from './user.service';
import { updateUserDto } from './dto/updatUser.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptors';
import { userDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserService.name);
  constructor(private userServices: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  @UseInterceptors(new Serialize(userDto))
  userList() {
    try {
      return this.userServices.findAll();
    } catch (error) {
      throw new InternalServerErrorException('something went wrong!');
    }
  }

  @Post('/signup')
  @UseInterceptors(new Serialize(userDto))
  createUser(@Body() body: CreateUser) {
    try {
      return this.userServices.createUser(
        body.email,
        body.password,
        body.userName,
      );
    } catch (error) {
      throw new InternalServerErrorException('something went wrong!');
    }
  }

  @Post('/signin')
  loginUser(@Body() body: LoginUser) {
    try {
      return this.userServices.loging(body.email, body.password);
    } catch (error) {
      throw new InternalServerErrorException('something went wrong!');
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    try {
      return this.userServices.deleteUser(id);
    } catch (error) {
      throw new InternalServerErrorException('something went wrong!');
    }
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  updateUser(@Body() body: updateUserDto, @Param('id') id: string) {
    try {
      return this.userServices.updateUser(id, body);
    } catch (error) {
      throw new InternalServerErrorException('something went wrong!');
    }
  }
}
