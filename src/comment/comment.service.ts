import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PostService } from 'src/post/post.service';
import { PaginatedQuery } from 'src/shared/dto/paginated-query.dto';
import { PaginatedResponseSchema } from 'src/shared/dto/paginated-response-schema.dto';
import { getPaginationMetaData } from 'src/shared/helpers/get-pagination-data.helper';
import { User, UserRole } from 'src/user/schemas/user.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private postService: PostService,
  ) {}
  async create(createCommentDto: CreateCommentDto, user: User) {
    const post = await this.postService.findOne(createCommentDto.postId);

    if (!post || post.deleted_at)
      throw new HttpException('پست یافت نشد', HttpStatus.BAD_REQUEST);

    //check is reply
    const replyId = mongoose.isValidObjectId(createCommentDto.replyId)
      ? new mongoose.Types.ObjectId(createCommentDto.replyId)
      : undefined;

    const comment = new this.commentModel({
      user: user._id,
      postId: post._id,
      created_at: new Date().toISOString(),
      content: createCommentDto.content,
      replyId,
    });
    return (await comment.save()).populate('user');
  }

  async findAll(
    postId: string,
    commentId: string,
    paginatedDto: PaginatedQuery,
  ): Promise<PaginatedResponseSchema<Comment[]>> {
    const query = this.commentModel.find({
      deleted_at: { $in: [null, undefined] },
      replyId: { $in: [null, undefined] },
    });
    if (postId && mongoose.isValidObjectId(postId)) {
      query.where('postId').equals(new mongoose.Types.ObjectId(postId));
    }
    if (commentId && mongoose.isValidObjectId(commentId)) {
      query.where('replyId').equals(new mongoose.Types.ObjectId(commentId));
    }
    const count = await query.clone().countDocuments();
    const { hasNextPage, pageNumber, skip, take, totalPages } =
      getPaginationMetaData(paginatedDto, count);
    const comments = await query
      .limit(take)
      .skip(skip)
      .sort('-created_at')
      .populate('user');

    return {
      data: comments,
      pagination_meta: { count, hasNextPage, pageNumber, take, totalPages },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, user: User) {
    const comment = await this.commentModel.findById(id);
    if (!comment || comment.deleted_at)
      throw new HttpException('یافت نشد .', HttpStatus.BAD_REQUEST);

    //check user access
    const isSameUser = comment.user._id.toString() === user._id.toString();

    if (user.role !== UserRole.Admin && !isSameUser)
      throw new HttpException(
        'شما دسترسی ویرایش ندارید .',
        HttpStatus.UNAUTHORIZED,
      );

    //update comment
    await comment.update({
      $set: { ...updateCommentDto, updated_at: new Date().toISOString() },
    });
    //show updated comment
    return this.commentModel.findById(id).populate('user');
  }

  async remove(id: string, user: User) {
    const comment = await this.commentModel.findById(id);
    if (!comment || comment.deleted_at)
      throw new HttpException('یافت نشد .', HttpStatus.BAD_REQUEST);

    //check user access
    const isSameUser = comment.user._id.toString() === user._id.toString();

    if (user.role !== UserRole.Admin && !isSameUser)
      throw new HttpException(
        'شما دسترسی ویرایش ندارید .',
        HttpStatus.UNAUTHORIZED,
      );
    //delete post
    await comment.updateOne({
      $set: { deleted_at: new Date().toISOString() },
    });

    throw new HttpException('نطر حذف شد', HttpStatus.OK);
  }
}
