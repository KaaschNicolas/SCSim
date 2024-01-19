import { Module } from '@nestjs/common';
import { ItemController } from './items.controller';
import { WaitingListController } from './waitingLists.controller';
import { WorkingStationCapacityController } from './workingStationCapacity.controller';
import { PurchasedItemController } from './purchasedItem.controller';
import { AllInOneController } from './allInOne.controller';

@Module({
    controllers: [ItemController, WaitingListController, WorkingStationCapacityController, PurchasedItemController, AllInOneController],
})
export class ControllerModule {}
