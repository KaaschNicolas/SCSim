import { Module } from '@nestjs/common';
import { CapacityService } from './capacity.service';
import { ItemService } from './item.service';
import { WaitingListService } from './waitingList.service';
import { DatabaseModule } from 'src/database/database.module';
import { PurchasedItemService } from './purchasedItem.service';
import { AllInOneService } from './allInOne.service';
import { FutureOrderService } from './futureOrder.service';

@Module({
    imports: [DatabaseModule],
    providers: [CapacityService, ItemService, WaitingListService, PurchasedItemService, AllInOneService, FutureOrderService],
})
export class ProviderModule {}
