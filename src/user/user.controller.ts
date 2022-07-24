import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { ApiResponseSchema } from 'src/shared/decorators/api-response-schema';
import { UserReq } from 'src/shared/decorators/user.decorator';

import { PaginatedDto } from 'src/shared/dto/paginated-response.dto';
import { ResponseSchemaDto } from 'src/shared/dto/response-schema.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@ApiExtraModels(User, PaginatedDto, ResponseSchemaDto, LoginResponseDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register_user')
  @ApiResponseSchema(User)
  async create(@Body() user: CreateUserDto) {
    //check email
    const findByEmail = await this.userService.findByEmail(user.email);
    if (findByEmail) {
      throw new HttpException('ایمیل قبلا ثبت شده است', HttpStatus.BAD_REQUEST);
    }
    return this.userService.create(user);
  }

  @Post('login')
  @ApiResponseSchema(LoginResponseDto)
  async login(@Body() user: LoginUserDto) {
    return this.userService.login(user);
  }

  @Get('profile')
  @ApiResponseSchema(User)
  @UseGuards(JwtAuthGuard)
  async profile(@UserReq() user: User) {
    return user;
  }
}
