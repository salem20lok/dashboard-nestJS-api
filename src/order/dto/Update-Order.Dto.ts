import { OrderItems } from '../order.interface';

export class UpdateOrderDto {
  orderStatus: string;
  orderItems: OrderItems[];
  total: number;
}
