import { Injectable } from '@nestjs/common';
import { ItemService } from './item.service';
import { OrderService } from './order.service';
import { CapacityService } from './capacity.service';
import { AllInOneDto } from '../dto/allInOne.dto';

@Injectable()
export class AllInOneService {
    constructor(
        private readonly itemService: ItemService,
        private readonly orderService: OrderService,
        private readonly capacityService: CapacityService,
    ) {}

    public async provideAllInOne() {
        let allInOne: AllInOneDto = new AllInOneDto();

        await this.itemService.triggerCalculateBom();

        allInOne.itemList = await this.itemService.getAll();

        allInOne.orders = await this.orderService.getOrders();

        let res = await this.capacityService.create();
        let res1 = await this.capacityService.capacityWaitingList(res);
        allInOne.workingStationCapacities = (
            await this.capacityService.capacityOrdersInWork(res1)
        );

        return allInOne;
    }
}
