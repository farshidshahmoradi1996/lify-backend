import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;
export enum USER_ROLE {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  USER = 'USER',
}
@Schema()
export class User {
  @ApiProperty()
  @Prop()
  email: string;

  @Prop()
  password: string;

  @ApiProperty()
  @Prop()
  created_at: string;

  @ApiProperty()
  @Prop()
  updated_at: string;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop(USER_ROLE)
  role: USER_ROLE;
}

export const UserSchema = SchemaFactory.createForClass(User);

//on save document update \updated_at\ automatically
UserSchema.pre('save', function (next) {
  this.updated_at = new Date().toISOString();
  next();
});
