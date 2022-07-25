import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type PostDocument = BlogPost & Document;

@Schema()
export class BlogPost {
  _id: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop({ type: mongoose.Types.ObjectId })
  id: string;

  @ApiProperty()
  @Prop()
  title: string;

  @ApiProperty()
  @Prop()
  content: string;

  @ApiProperty()
  @Prop()
  image_url: string;

  @ApiProperty()
  @Prop({ required: true })
  created_at: string;

  @ApiProperty()
  @Prop()
  updated_at: string;

  @Prop()
  deleted_at: string;

  @ApiProperty()
  @Prop({ type: Number, default: 0 })
  like_count: number;

  @ApiProperty()
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const PostSchema = SchemaFactory.createForClass(BlogPost);

PostSchema.set('toJSON', {
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});
