import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OrderService } from '../providers/order.service';
import { FutureOrderDto } from '../dto/futureOrder.dto';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    getOrders() {
        return this.orderService.getOrders();
    }

    @Post()
    postOrders(@Query('period') period: number, @Body() futureOrder: FutureOrderDto[]) {
        this.orderService.insert(futureOrder, period);
    }
}
