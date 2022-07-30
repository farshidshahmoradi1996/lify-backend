import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { BlogPost } from 'src/post/schemas/blog-post.schema';

export type BookmarkDocument = Bookmark & Document;

@Schema()
export class Bookmark {
  _id: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop({ type: mongoose.Types.ObjectId })
  id: string;

  @ApiProperty()
  @Prop({ required: true })
  created_at: Date;

  @ApiProperty({ required: true })
  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'BlogPost' })
  post: BlogPost;

  @ApiProperty({ required: true })
  @Prop({ required: true })
  userId: string;
}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);

BookmarkSchema.set('toJSON', {
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});
