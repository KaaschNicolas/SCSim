import { Module } from '@nestjs/common';
import { CapacityService } from './capacity.service';
import { BomService } from './bom.service';
import { WaitingListService } from './waitingList.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [CapacityService, BomService, WaitingListService],
})
export class ProviderModule {}
