import { Body, Controller, Post } from '@nestjs/common';
import { FutureOrderService } from '../providers/futureOrder.service';
import { FutureOrderDto } from '../dto/futureOrder.dto';

@Controller('futureOrders')
export class FutureOrderController {
    constructor(private readonly futureOrderService: FutureOrderService) {}

    @Post('/insertFutureOrders')
    upsert(@Body() futureOrderList: FutureOrderDto[]) {
        this.futureOrderService.insert(futureOrderList);

    }
}