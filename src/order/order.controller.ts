import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/Create-Order.Dto';
import { GetUser } from '../auth/get-user.decorator';
import { Order, OrderDocument } from './Schemas/order.schema';
import { RolesGuard } from '../auth/Authorization/roles.guard';
import { Roles } from '../auth/Authorization/roles.decorator';
import { Role } from '../auth/Authorization/role.enum';
import { OrdersPaginationDto } from './dto/Orders-Pagination.Dto';
import { UpdateOrderDto } from './dto/Update-Order.Dto';
import { Response } from 'express';
import { Parser } from 'json2csv';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('order')
export class OrderController {
  constructor(
    private readonly OrderService: OrderService,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  myOrders(
    @Query() orderPaginationDto: OrdersPaginationDto,
    @GetUser() id: string,
  ): Promise<Order[]> {
    console.log('********');
    return this.OrderService.myOrders(orderPaginationDto, id);
  }

  @Get('export')
  async export(@Res() res: Response) {
    const parser = new Parser({
      fields: ['ID', 'Name', 'Email', 'Product Title', 'Price', 'Quantity'],
    });

    const json = [];
    const order = await this.orderModel.find({});
    order.forEach((el: Order) => {
      json.push({
        id: el.user._id,
        name: el.user.lastName,
        email: el.user.email,
        'product Title': '',
        price: '',
        Quantity: '',
      });

      el.orderItems.forEach((e) => {
        json.push({
          id: '',
          name: '',
          email: '',
          'product Title': e.title,
          price: e.price,
          Quantity: e.qte,
        });
      });
    });
    const csv = parser.parse(json);
    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    return res.send(csv);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  allOrders(
    @Query() orderPaginationDto: OrdersPaginationDto,
  ): Promise<Order[]> {
    return this.OrderService.allOrders(orderPaginationDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getOrdre(@Param('id') id: string): Promise<Order> {
    return this.OrderService.getOrdre(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() id: string,
  ): Promise<Order> {
    createOrderDto.user = id;
    return this.OrderService.createOrder(createOrderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  deleteOrder(@Param('id') id: string): Promise<void> {
    return this.OrderService.deleteOrder(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.OrderService.updateOrder(id, updateOrderDto);
  }
}
