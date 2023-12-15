import { Module } from '@nestjs/common';
import { CapacityService } from './capacity.service';
import { ItemService } from './item.service';
import { WaitingListService } from './waitingList.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [CapacityService, ItemService, WaitingListService],
})
export class ProviderModule {}
