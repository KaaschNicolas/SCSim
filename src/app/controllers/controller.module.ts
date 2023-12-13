import { Module } from '@nestjs/common';
import { ItemController } from './items.controller';
import { WaitingListController } from './waitingLists.controller';
import { WorkingStationCapacityController } from './workingStationCapacity.controller';

@Module({
    controllers: [ItemController, WaitingListController, WorkingStationCapacityController],
})
export class ControllerModule {}