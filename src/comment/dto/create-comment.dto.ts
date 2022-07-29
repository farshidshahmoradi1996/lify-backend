import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @Prop()
  content: string;

  @ApiProperty()
  @IsString()
  @Prop()
  postId: string;

  @ApiProperty({ required: false })
  @Prop()
  replyId: string;
}
