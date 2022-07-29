import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  _id: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop({ type: mongoose.Types.ObjectId })
  id: string;

  @ApiProperty()
  @Prop({ required: true })
  created_at: Date;

  @ApiProperty()
  @Prop()
  updated_at: Date;

  @Prop()
  deleted_at: Date;

  @ApiProperty({ required: true })
  @Prop({ required: true })
  content: string;

  @ApiProperty({ required: true })
  @Prop({ required: true, type: mongoose.Types.ObjectId })
  postId: string;

  @ApiProperty({ required: false })
  @Prop({ required: false, type: mongoose.Types.ObjectId })
  replyId: string;

  @ApiProperty({ required: true })
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.set('toJSON', {
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});
