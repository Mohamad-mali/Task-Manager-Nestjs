import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

//internal Imports
import { CreateUser } from './DTO/signup.DTO';
import { LoginUser } from './DTO/signin.DTO';
import { UserService } from './user.service';
import { UpdateUserDto } from './DTO/updatUser.DTO';
import { AuthGuard } from '../auth/auth.guard';
import { Serialize } from './interceptors/serialize.interceptors';
import { userDto } from './DTO/user.DTO';

//Custom Types
import type { Pagination } from './types/pagination.type';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private userServices: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'get a list of the first 10 user',
  })
  @ApiQuery({ name: 'page', description: 'page number', example: '1' })
  @ApiQuery({
    name: 'take',
    description: 'number of item per page',
    example: '10',
  })
  @ApiResponse({ status: 200, description: 'list of the user' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  async userList(@Query('page') page?: number, @Query('take') take?: number) {
    const data: Pagination = {
      page,
      take,
    };

    return await this.userServices.findAll(data);
  }

  @Post('signup')
  @ApiOperation({
    summary: 'Create a user',
  })
  @ApiBody({
    description: 'The user data with is used to create the user',
    type: CreateUser,
    examples: {
      valid: {
        summary: 'a valid example',
        value: {
          userName: 'tester',
          email: 'test@example.com',
          password: '12345678',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'the user id and the email' })
  @UseInterceptors(new Serialize(userDto))
  async createUser(@Body() body: CreateUser) {
    return await this.userServices.createUser(
      body.email,
      body.password,
      body.userName,
    );
  }

  @Post('signin')
  @ApiOperation({
    summary: 'log in the user',
  })
  @ApiBody({
    description:
      'login info of the user that is already a user at website or app',
    type: LoginUser,
    examples: {
      valid: {
        summary: 'a valid example',
        value: {
          email: 'test@example.com',
          password: '12345678',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'the user JWT(Json Web Token)' })
  async loginUser(@Body() body: LoginUser) {
    return await this.userServices.loging(body.email, body.password);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a user with the given ID',
  })
  @ApiParam({
    name: 'id',
    description: 'uniqe id of the user with is a uuid',
    example: 'aaaaaaaa-bbb1-1111-11c1-2222a11112a1',
  })
  @UseInterceptors(new Serialize(userDto))
  async deleteUser(@Param('id') id: string) {
    return await this.userServices.deleteUser(id);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user with the given ID',
  })
  @ApiParam({
    name: 'id',
    description: 'uniqe id of the user with is a uuid',
    example: 'aaaaaaaa-bbb1-1111-11c1-2222a11112a1',
  })
  @ApiBody({
    description:
      'login info of the user that is already a user at website or app',
    type: UpdateUserDto,
    examples: {
      valid: {
        summary: 'a valid example',
        value: {
          userName: 'Example',
          email: 'test@example.com',
          oldPassword: '12345678',
          newPassword: '87654321',
        },
      },
    },
  })
  @UseInterceptors(new Serialize(userDto))
  async updateUser(@Body() body: UpdateUserDto, @Param('id') id: string) {
    return await this.userServices.updateUser(id, body);
  }
}
