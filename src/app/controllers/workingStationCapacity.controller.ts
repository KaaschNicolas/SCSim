import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CapacityService } from '../providers';

@Controller('workingStationCapacity')
export class workingStationCapacityController {
    constructor(private readonly capacityService: CapacityService) {}

    @Get('')
    getAll() {
        return;
    }
}
