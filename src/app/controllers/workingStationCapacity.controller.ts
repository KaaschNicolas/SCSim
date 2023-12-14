import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CapacityService } from '../providers/capacity.service';

@Controller('workingStationCapacity')
export class WorkingStationCapacityController {
    constructor(private readonly capacityService: CapacityService) {}

    @Get('')
    async getAll() {
        return await this.capacityService.create();
    }
}
