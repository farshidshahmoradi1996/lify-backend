import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatedQuery } from 'src/shared/dto/paginated-query.dto';
import { PaginatedResponseSchema } from 'src/shared/dto/paginated-response-schema.dto';

import { getPaginationMetaData } from 'src/shared/helpers/get-pagination-data.helper';
import { User, UserRole } from 'src/user/schemas/user.schema';
import { ChangeLikeStatusDto } from './dto/change-like-status.dto';
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

    //transform data
    const data = posts.map((item) => ({
      ...item.toJSON(),
      like_count: Array.isArray(item.liked_users) ? item.liked_users.length : 0,
      liked_users: undefined,
    }));

    return {
      data,
      pagination_meta: { pageNumber, take, totalPages, count, hasNextPage },
    };
  }

  async findOne(id: string): Promise<BlogPost> {
    const blogPost = await this.postModel
      .findOne({ deleted_at: undefined, _id: id })
      .populate('user');
    if (!blogPost)
      throw new HttpException('پست یافت نشد', HttpStatus.NOT_FOUND);
    const data = blogPost.toJSON();
    data.like_count = Array.isArray(data.liked_users)
      ? data.liked_users.length
      : 0;

    //remove liked_users property in response
    data.liked_users = undefined;

    return data;
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

  async changeLikeStatus(changeLikeStatusDto: ChangeLikeStatusDto, user: User) {
    const post = await this.postModel.findById(changeLikeStatusDto.postId);

    if (!post || post.deleted_at)
      throw new HttpException('پست یافت نشد', HttpStatus.BAD_REQUEST);

    const userLikedPost = post.liked_users.includes(user._id.toString());
    if (changeLikeStatusDto.like) {
      //like post
      if (userLikedPost) {
        throw new HttpException(
          'شما قبلا این پست رو لایک کردید .',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        await post.updateOne({
          $set: { liked_users: [...post.liked_users, user._id.toString()] },
        });
      }
    } else {
      //dislike post
      if (!userLikedPost) {
        throw new HttpException(
          'شما این پست رو لایک نکرده بودید',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        await post.updateOne({
          $set: {
            liked_users: post.liked_users.filter(
              (item) => item.toString() !== user._id.toString(),
            ),
          },
        });
      }
    }

    return this.findOne(post._id.toString());
  }
}
