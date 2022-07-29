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
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BlogPost } from './schemas/blog-post.schema';
import { ApiResponseSchema } from 'src/shared/decorators/api-response-schema';
import { ApiPaginatedResponse } from 'src/shared/decorators/api-paginated-response';
import { UserReq } from 'src/shared/decorators/user.decorator';
import { User } from 'src/user/schemas/user.schema';
import { PaginatedQuery } from 'src/shared/dto/paginated-query.dto';

@ApiTags('posts')
@ApiBearerAuth()
@ApiExtraModels(BlogPost)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create_post')
  @UseGuards(JwtAuthGuard)
  @ApiResponseSchema(BlogPost)
  create(@Body() createPostDto: CreatePostDto, @UserReq() user: User) {
    return this.postService.create(createPostDto, user);
  }

  @Get()
  @ApiPaginatedResponse(BlogPost)
  findAll(@Query() paginatedDto: PaginatedQuery) {
    return this.postService.findAll(paginatedDto);
  }

  @Get(':id')
  @ApiResponseSchema(BlogPost)
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @ApiResponseSchema(BlogPost)
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UserReq() user: User,
  ) {
    return this.postService.update(id, updatePostDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @UserReq() user: User) {
    return this.postService.remove(id, user);
  }
}
