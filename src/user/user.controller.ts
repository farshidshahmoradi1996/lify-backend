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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ApiResponseSchema } from 'src/shared/decorators/api-response-schema';
import { PaginatedDto } from 'src/shared/dto/paginated-response.dto';
import { ResponseSchemaDto } from 'src/shared/dto/response-schema.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
@ApiExtraModels(User, PaginatedDto, ResponseSchemaDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register_user')
  @UsePipes(new ValidationPipe())
  @ApiResponseSchema(User)
  async create(@Body() user: CreateUserDto) {
    //check email
    const findByEmail = await this.userService.findByEmail(user.email);
    if (findByEmail) {
      throw new HttpException('ایمیل قبلا ثبت شده است', HttpStatus.BAD_REQUEST);
    }
    return this.userService.create(user);
  }

  @Get()
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'get all users',
    schema: {
      type: 'object',
      example: { data: { name: 'sdsdsmjjsdsssdsdsdsdsdss' } },
      properties: { id: {} },
    },
  })
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
