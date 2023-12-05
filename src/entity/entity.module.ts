import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { ProductionProcess } from './productionProcess.entity';
import { PurchasedItem } from './purchasedItem.entity';
import { WorkingStation } from './workingStation.entity';
import { Module } from '@nestjs/common';
import { WaitingList } from './waitingList.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Item, ProductionProcess, PurchasedItem, WorkingStation, WaitingList])],
})
export class EntityModule {}
