import { OrderItems } from '../order.interface';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  user: string;

  @IsNotEmpty()
  orderItems: OrderItems[];

  @IsNotEmpty()
  orderStatus: string;

  total: number;
}
