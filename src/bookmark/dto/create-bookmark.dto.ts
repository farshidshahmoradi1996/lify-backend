import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({ required: true })
  @IsString()
  postId: string;
}
