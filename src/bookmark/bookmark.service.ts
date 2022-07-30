import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { Bookmark, BookmarkDocument } from './schemas/bookmark.schema';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel(Bookmark.name) private BookmarkModel: Model<BookmarkDocument>,
  ) {}
  async create(createBookmarkDto: CreateBookmarkDto, user: User) {
    const bookmark = new this.BookmarkModel({
      post: new mongoose.Types.ObjectId(createBookmarkDto.postId),
      userId: user._id,
      created_at: new Date().toISOString(),
    });
    //save
    await bookmark.save();
    const data = (await bookmark.populate({ path: 'post' })).toJSON();
    data.userId = undefined;

    if (data.post) data.post.liked_users = undefined;

    return data;
  }

  async removeFromBookmark(createBookmarkDto: CreateBookmarkDto, user: User) {
    const query = await this.BookmarkModel.find({
      post: new mongoose.Types.ObjectId(createBookmarkDto.postId),
      userId: user._id.toString(),
    });

    const itemsToDelete = query.map((item) => item._id);

    await this.BookmarkModel.deleteMany({ _id: { $in: itemsToDelete } });

    return 'پست از ذخیره ها حذف شد ';
  }
}
