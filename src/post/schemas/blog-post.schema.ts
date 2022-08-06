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

  @ApiProperty({ required: false })
  @Prop()
  image_url: string;

  @ApiProperty()
  @Prop({ required: true })
  created_at: Date;

  @ApiProperty()
  @Prop()
  updated_at: Date;

  @Prop()
  deleted_at: Date;

  @ApiProperty()
  like_count: number;

  @ApiProperty()
  liked_counts: number;

  @ApiProperty()
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: [mongoose.Types.ObjectId], required: false, default: [] })
  liked_users?: string[];
}

export const PostSchema = SchemaFactory.createForClass(BlogPost);

PostSchema.set('toJSON', {
  versionKey: false,
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.liked_users;
  },
});

PostSchema.virtual('liked_counts').get(function () {
  return Array.isArray(this.liked_users) ? this.liked_users.length : 0;
});
