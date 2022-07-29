import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiPaginatedResponse } from 'src/shared/decorators/api-paginated-response';
import { ApiResponseSchema } from 'src/shared/decorators/api-response-schema';
import { UserReq } from 'src/shared/decorators/user.decorator';
import { PaginatedQuery } from 'src/shared/dto/paginated-query.dto';
import { User } from 'src/user/schemas/user.schema';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './schemas/comment.schema';

@ApiTags('comments')
@ApiExtraModels(Comment)
@ApiBearerAuth()
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiResponseSchema(Comment)
  create(@Body() createCommentDto: CreateCommentDto, @UserReq() user: User) {
    return this.commentService.create(createCommentDto, user);
  }

  @Get()
  @ApiPaginatedResponse(Comment)
  @ApiQuery({ name: 'postId', required: false })
  findAll(
    @Query('postId') postId: string,
    @Query() paginatedDto: PaginatedQuery,
  ) {
    return this.commentService.findAll(postId, null, paginatedDto);
  }

  @Get('replies/:commentId')
  @ApiPaginatedResponse(Comment)
  findAllReplies(
    @Param('commentId') commentId: string,
    @Query() paginatedDto: PaginatedQuery,
  ) {
    return this.commentService.findAll(null, commentId, paginatedDto);
  }

  @Patch(':id')
  @ApiResponseSchema(Comment)
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @UserReq() user: User,
  ) {
    return this.commentService.update(id, updateCommentDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @UserReq() user: User) {
    return this.commentService.remove(id, user);
  }
}
