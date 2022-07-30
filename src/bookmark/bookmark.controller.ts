import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserReq } from 'src/shared/decorators/user.decorator';
import { User } from 'src/user/schemas/user.schema';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@ApiBearerAuth()
@ApiTags('bookmarks')
@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post('add_to_bookmark')
  create(@Body() createBookmarkDto: CreateBookmarkDto, @UserReq() user: User) {
    return this.bookmarkService.create(createBookmarkDto, user);
  }
  @Post('remove_from_bookmarks')
  removeFromBookmark(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @UserReq() user: User,
  ) {
    return this.bookmarkService.removeFromBookmark(createBookmarkDto, user);
  }
}
