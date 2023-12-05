import { Module } from '@nestjs/common';
import { CapacityService } from './capacity.service';
import { BomService } from './bom.service';

@Module({
    providers: [CapacityService, BomService],
})
export class ProviderModule {}
