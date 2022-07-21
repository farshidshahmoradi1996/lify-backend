import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    //check email
    const findByEmail = await this.findByEmail(createUserDto.email);
    if (findByEmail) {
      throw new HttpException('ایمیل قبلا ثبت شده است', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.userModel({
      ...createUserDto,
      created_at: new Date().toISOString(),
      password: this.createHashedPassword(createUserDto.password),
    });
    await createdUser.save();
    createdUser.password = undefined;
    return createdUser;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
  createHashedPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
}
