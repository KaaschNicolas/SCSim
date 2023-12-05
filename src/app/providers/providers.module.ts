import { Module } from '@nestjs/common';
import { CapacityService } from './capacity.service';
import { BomService } from './bom.service';
import { WaitingListService } from './waitingList.service';

@Module({
    providers: [CapacityService, BomService, WaitingListService],
})
export class ProviderModule {}
