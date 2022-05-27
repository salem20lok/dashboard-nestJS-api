import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User, UserDocument } from '../../user/schemas/user.schema';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: String, required: true, index: true, unique: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  category: string;

  @Prop({
    type: String,
    required: true,
    default: '/images/product/product.jpg',
  })
  images: string;

  @Prop({ type: Number, required: true, default: 0.0 })
  price: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  user: UserDocument;

  @Prop({ type: Number, required: true, default: 0 })
  stock: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
