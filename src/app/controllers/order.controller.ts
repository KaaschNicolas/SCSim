import { Controller, Get } from '@nestjs/common';
import { OrderService } from '../providers/order.service';

@Controller()
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    getOrders() {
        return this.orderService.getOrders();
    }
}