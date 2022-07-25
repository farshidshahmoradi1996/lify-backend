import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @Prop()
  @IsString()
  title: string;

  @ApiProperty()
  @Prop()
  @IsString()
  content: string;

  @ApiProperty()
  @Prop()
  @IsString()
  image_url: string;
}
