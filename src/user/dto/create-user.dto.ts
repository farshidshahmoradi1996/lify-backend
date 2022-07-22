import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'john@gmail.com' })
  @IsString()
  @IsEmail()
  @Prop()
  email: string;

  @ApiProperty({ example: '12345' })
  @IsString()
  @MinLength(5)
  @Prop()
  password: string;

  @ApiProperty({ example: 'John Carry' })
  @IsString()
  @Prop()
  name: string;
}
