import { Module } from '@nestjs/common';
import { CapacityService } from './capacity.service';

@Module({
    providers: [CapacityService],
})
export class ProviderModule {}
