import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { Response } from 'express';

import { JoiValidationPipe } from 'src/joi-validation-pipe.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserValidationSchema } from './schemas/user-validation.schema';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register_user')
  @UsePipes(new JoiValidationPipe(UserValidationSchema))
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'new user saved successfully',
    type: User,
  })
  async create(
    @Res() response: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    const findByEmail = await this.userService.findByEmail(createUserDto.email);
    if (findByEmail) {
      throw new HttpException('ایمیل قبلا ثبت شده است', HttpStatus.BAD_REQUEST);
    }
    const result = await this.userService.create(createUserDto);
    if (result)
      response
        .status(HttpStatus.CREATED)
        .json(Object.assign(result, { password: undefined }));
    else throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}