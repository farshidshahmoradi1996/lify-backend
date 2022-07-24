import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  Admin = 'Admin',
  User = 'User',
}

@Schema()
export class User {
  _id: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop({ type: mongoose.Types.ObjectId })
  id: string;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  @ApiProperty({ required: false })
  created_at: string;

  @Prop()
  @ApiProperty({ required: false })
  updated_at: string;

  @Prop(UserRole)
  @ApiProperty({ required: false, enum: UserRole })
  role: UserRole;

  @Prop()
  @ApiProperty({ required: false })
  image_url: string;

  @Prop()
  @ApiProperty({ required: false })
  headline: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

//on save document update "updated_at" automatically
UserSchema.pre('save', function (next) {
  this.updated_at = new Date().toISOString();
  if (!this.role) this.role = UserRole.User;
  next();
});

UserSchema.set('toJSON', {
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password;
  },
});
