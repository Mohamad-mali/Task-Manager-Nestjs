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
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

//internal Imports
import { CreateUser } from './dto/signup.dto';
import { LoginUser } from './dto/signin.dto';
import { UserService } from './user.service';
import { updateUserDto } from './dto/updatUser.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserService.name);
  constructor(private userServices: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  userList() {
    return this.userServices.findAll();
  }

  @Post('/signup')
  createUser(@Body() body: CreateUser) {
    return this.userServices.createUser(
      body.email,
      body.password,
      body.userName,
    );
  }

  @Post('/signin')
  loginUser(@Body() body: LoginUser) {
    return this.userServices.loging(body.userName, body.password);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userServices.deleteUser(id);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  updateUser(@Body() body: updateUserDto, @Param('id') id: string) {
    return this.userServices.updateUser(id, body);
  }
}
