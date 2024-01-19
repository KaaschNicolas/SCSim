import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from '../providers/order.service';
import { FutureOrderDto } from '../dto/futureOrder.dto';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    getOrders() {
        //return this.orderService.getOrders();
    }
    @Post()
    postOrders(@Body() futureOrder: FutureOrderDto[]) {
        this.orderService.insert(futureOrder);
    }
}
