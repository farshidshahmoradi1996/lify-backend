import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatedQuery } from 'src/shared/dto/paginated-query.dto';
import { PaginatedResponseSchema } from 'src/shared/dto/paginated-response-schema.dto';
import { PaginatedDto } from 'src/shared/dto/paginated-response.dto';
import { getPaginationData } from 'src/shared/helpers/get-pagination-data.helper';
import { User } from 'src/user/schemas/user.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostDocument, BlogPost } from './schemas/post.schema';

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
    const count = await this.postModel.countDocuments();
    const { pageNumber, skip, take, totalPages } = getPaginationData(
      paginationData,
      count,
    );
    const posts = await this.postModel
      .find()
      .limit(take)
      .skip(skip)
      .populate('user');

    return {
      data: posts,
      pagination_meta: { pageNumber, take, totalPages, count },
    };
  }

  async findOne(id: string) {
    const findPost = await this.postModel.findById(id).populate('user');
    return findPost;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
