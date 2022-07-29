import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { BlogPost, PostSchema } from './schemas/blog-post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BlogPost.name, schema: PostSchema }]),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
