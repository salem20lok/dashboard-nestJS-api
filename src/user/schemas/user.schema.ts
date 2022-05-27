import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../auth/Authorization/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true, index: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: [String],
    required: true,
    default: Role.User,
    enum: Role,
  })
  role: string[];

  @Prop({ type: String, default: '/images/avatar.png' })
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
