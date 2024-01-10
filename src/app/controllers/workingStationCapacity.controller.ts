import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CapacityService } from '../providers/capacity.service';

@Controller('workingStationCapacity')
export class WorkingStationCapacityController {
    constructor(private readonly capacityService: CapacityService) {}

    @Get('')
    async getAll() {
        let res = await this.capacityService.create();
        let res1 = await this.capacityService.capacityWaitingList(res);
        let res2 = await this.capacityService.capacityOrdersInWork(res1);
        return res2;
    }
}
