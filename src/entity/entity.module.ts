import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { ProductionProcess } from './productionProcess.entity';
import { PurchasedItem } from './purchasedItem.entity';
import { WorkingStation } from './workingStation.entity';
import { Module } from '@nestjs/common';

@Module({
    imports: [TypeOrmModule.forFeature([Item, ProductionProcess, PurchasedItem, WorkingStation])],
})
export class EntityModule {}
