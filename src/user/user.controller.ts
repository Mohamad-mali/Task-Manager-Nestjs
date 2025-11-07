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
  UseInterceptors,
  Query,
} from '@nestjs/common';

//internal Imports
import { CreateUser } from './DTO/signup.DTO';
import { LoginUser } from './DTO/signin.DTO';
import { UserService } from './user.service';
import { updateUserDto } from './DTO/updatUser.DTO';
import { AuthGuard } from '../auth/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptors';
import { userDto } from './DTO/user.DTO';

//Custom Types
import type { Pagination } from './types/pagination.type';

@Controller('user')
@UseInterceptors(new Serialize(userDto))
export class UserController {
  constructor(private userServices: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  async userList(@Query('page') page?: number, @Query('take') take?: number) {
    const data: Pagination = {
      page,
      take,
    };

    return await this.userServices.findAll(data);
  }

  @Post('signup')
  async createUser(@Body() body: CreateUser) {
    return await this.userServices.createUser(
      body.email,
      body.password,
      body.userName,
    );
  }

  @Post('signin')
  async loginUser(@Body() body: LoginUser) {
    return await this.userServices.loging(body.email, body.password);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.userServices.deleteUser(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUser(@Body() body: updateUserDto, @Param('id') id: string) {
    return await this.userServices.updateUser(id, body);
  }
}
