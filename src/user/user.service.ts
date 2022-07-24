import { HttpException, HttpStatus, Injectable, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

import { JwtService } from '@nestjs/jwt';
import { UserReq } from 'src/shared/decorators/user.decorator';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async create(user: CreateUserDto) {
    const createdUser = new this.userModel({
      ...user,
      created_at: new Date().toISOString(),
      password: this.generateHash(user.password),
    });
    return createdUser.save();
  }

  findAll() {
    return this.userModel.find();
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.userModel.findById(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email });
  }
  generateHash(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
  async login(loginUser: LoginUserDto) {
    const user = await this.findByEmail(loginUser.email);
    if (!user)
      throw new HttpException('کاربری یافت نشد.', HttpStatus.BAD_REQUEST);
    const passwordMatch = await bcrypt.compare(
      loginUser.password,
      user.password,
    );
    if (!passwordMatch)
      throw new HttpException('کلمه عبور اشتباه است.', HttpStatus.BAD_REQUEST);

    const payload = {
      email: user.email,
      role: user.role,
      sub: user._id,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_PASSPORT_SECRET_KEY,
      }),
      user,
    };
  }

  async getUserProfile(@UserReq() user: User) {
    console.log(user);

    return user;
  }
}
