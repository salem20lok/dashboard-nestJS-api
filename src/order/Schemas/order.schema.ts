import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User, UserDocument } from '../../user/schemas/user.schema';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  user: UserDocument;

  @Prop({ type: [{ type: mongoose.Schema.Types.Mixed, required: true }] })
  orderItems: [
    {
      title: { type: string; required: true };
      images: { type: string; required: true };
      price: { type: number; required: true };
      product: { type: string; required: true };
      qte: { type: number; required: true };
    },
  ];

  @Prop({
    type: String,
    default: 'processing',
    enum: ['delivered', 'processing', 'waiting', 'confirmed'],
  })
  orderStatus: string;

  @Prop({ type: Number, required: true, default: 0 })
  total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
