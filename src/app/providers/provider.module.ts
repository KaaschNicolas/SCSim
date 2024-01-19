import { Module } from '@nestjs/common';
import { CapacityService } from './capacity.service';
import { ItemService } from './item.service';
import { WaitingListService } from './waitingList.service';
import { DatabaseModule } from 'src/database/database.module';
import { PurchasedItemService } from './purchasedItem.service';
import { AllInOneService } from './allInOne.service';
import { OrderService } from './order.service';

@Module({
    imports: [DatabaseModule],
    providers: [CapacityService, ItemService, WaitingListService, PurchasedItemService, AllInOneService, OrderService],
})
export class ProviderModule {}
