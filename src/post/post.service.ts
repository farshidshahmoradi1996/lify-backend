import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatedQuery } from 'src/shared/dto/paginated-query.dto';
import { PaginatedResponseSchema } from 'src/shared/dto/paginated-response-schema.dto';

import { getPaginationMetaData } from 'src/shared/helpers/get-pagination-data.helper';
import { User, UserRole } from 'src/user/schemas/user.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostDocument, BlogPost } from './schemas/blog-post.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(BlogPost.name) private postModel: Model<PostDocument>,
  ) {}
  async create(createPostDto: CreatePostDto, user: User) {
    const newPost = new this.postModel({
      title: createPostDto.title,
      image_url: createPostDto.image_url,
      content: createPostDto.content,
      created_at: new Date().toISOString(),
      user: user._id,
    });
    return (await newPost.save()).populate('user');
  }

  async findAll(
    paginationData: PaginatedQuery,
  ): Promise<PaginatedResponseSchema<BlogPost[]>> {
    const query = this.postModel.find({
      deleted_at: { $in: [null, undefined] },
    });
    const count = await query.clone().countDocuments();
    const { pageNumber, totalPages, hasNextPage, take, skip } =
      getPaginationMetaData(paginationData, count);
    const posts = await query.limit(take).skip(skip).populate('user');

    return {
      data: posts,
      pagination_meta: { pageNumber, take, totalPages, count, hasNextPage },
    };
  }

  async findOne(id: string) {
    const blogPost = await this.postModel
      .findOne({ deleted_at: undefined, _id: id })
      .populate('user');
    if (!blogPost)
      throw new HttpException('پست یافت نشد', HttpStatus.NOT_FOUND);

    return blogPost;
  }

  async update(id: string, updatePostDto: UpdatePostDto, user: User) {
    const blogPost = await this.postModel.findById(id);

    //check post exists
    if (!blogPost)
      throw new HttpException('پست یافت نشد .', HttpStatus.BAD_REQUEST);

    //check delete post
    if (blogPost.deleted_at)
      throw new HttpException('پست حذف شده است .', HttpStatus.BAD_REQUEST);

    //check user access
    const isSameUser = blogPost.user._id.toString() === user._id.toString();

    if (user.role !== UserRole.Admin && !isSameUser)
      throw new HttpException(
        'شما دسترسی ویرایش ندارید .',
        HttpStatus.UNAUTHORIZED,
      );

    //update post
    await blogPost.updateOne({
      $set: { ...updatePostDto, updated_at: new Date().toISOString() },
    });

    //show updated
    return this.findOne(id);
  }

  async remove(id: string, user: User) {
    const blogPost = await this.postModel.findById(id);

    //check post exists
    if (!blogPost)
      throw new HttpException('پست یافت نشد .', HttpStatus.BAD_REQUEST);

    //check delete post
    if (blogPost.deleted_at)
      throw new HttpException('پست حذف شده است .', HttpStatus.BAD_REQUEST);

    //check user access
    const isSameUser = blogPost.user._id.toString() === user._id.toString();

    if (user.role !== UserRole.Admin && !isSameUser)
      throw new HttpException(
        'شما دسترسی ویرایش ندارید .',
        HttpStatus.UNAUTHORIZED,
      );

    //delete post
    await blogPost.updateOne({
      $set: { deleted_at: new Date().toISOString() },
    });

    throw new HttpException('پست حذف شد', HttpStatus.OK);
  }
}
