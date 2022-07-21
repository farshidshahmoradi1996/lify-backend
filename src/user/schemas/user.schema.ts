import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
export type UserDocument = User & Document;
export enum USER_ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  created_at: string;

  @Prop()
  updated_at: string;

  @Prop()
  name: string;

  @Prop(USER_ROLE)
  role: USER_ROLE;

  @Prop()
  image_url: string;

  @Prop()
  headline: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

//on save document update "updated_at" automatically
UserSchema.pre('save', function (next) {
  this.updated_at = new Date().toISOString();
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
