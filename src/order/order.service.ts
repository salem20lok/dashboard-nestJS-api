import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './Schemas/order.schema';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/Create-Order.Dto';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { OrdersPaginationDto } from './dto/Orders-Pagination.Dto';
import { UpdateOrderDto } from './dto/Update-Order.Dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const total = createOrderDto.orderItems.reduce(
        (sum, el) => sum + Number(el.price) * Number(el.qte),
        0,
      );
      createOrderDto.total = total;
      const order = new this.orderModel(createOrderDto);
      const newOrder = await order.save().then(async (e) => {
        e.orderItems.map(async (el) => {
          const product = await this.productModel.findById(el.product);
          product.stock = product.stock - Number(el.qte);
          product.save();
        });
      });
      return order;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async deleteOrder(id: string): Promise<void> {
    await this.orderModel.findByIdAndDelete(id);
  }

  async allOrders(ordersPaginationDto: OrdersPaginationDto): Promise<Order[]> {
    const { skip, limit } = ordersPaginationDto;
    const ordres = await this.orderModel
      .find({})
      .skip(skip)
      .limit(limit)
      .populate('user');
    return ordres;
  }

  async myOrders(
    ordersPaginationDto: OrdersPaginationDto,
    id: string,
  ): Promise<Order[]> {
    const { skip, limit } = ordersPaginationDto;
    const ordres = await this.orderModel
      .find({ user: id })
      .skip(skip)
      .limit(limit)
      .populate('user');
    return ordres;
  }

  async getOrdre(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).populate('user');
    return order;
  }

  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const { orderStatus, orderItems } = updateOrderDto;
    const total = orderItems.reduce(
      (sum, el) => sum + Number(el.price) * Number(el.qte),
      0,
    );
    const order = await this.orderModel.findByIdAndUpdate(id, {
      orderStatus: orderStatus,
      orderItems: orderItems,
      total: total,
    });
    return order;
  }
}
