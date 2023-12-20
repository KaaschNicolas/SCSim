import { Module } from '@nestjs/common';
import { CapacityService } from './capacity.service';
import { ItemService } from './item.service';
import { WaitingListService } from './waitingList.service';
import { DatabaseModule } from 'src/database/database.module';
import { PurchasedItemService } from './purchasedItem.service';

@Module({
    imports: [DatabaseModule],
    providers: [CapacityService, ItemService, WaitingListService, PurchasedItemService],
})
export class ProviderModule {}
