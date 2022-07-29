import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

export class ChangeLikeStatusDto {
  @ApiProperty()
  @Prop()
  @IsString()
  postId: string;

  @ApiProperty()
  @Prop()
  @IsBoolean()
  like: boolean;
}
