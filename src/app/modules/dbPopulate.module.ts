import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { DbPopulateService } from '../providers/dbPopulate.service';
import { WorkingStation } from 'src/entity/workingStation.entity';
import { Module } from '@nestjs/common';
import { ProductionProcess } from 'src/entity/productionProcess.entity';
import { Item } from 'src/entity/item.entity';
import { PurchasedItem } from 'src/entity/purchasedItem.entity';
import { ItemPurchasedItem } from 'src/entity/itemPurchasedItem.entity';

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([WorkingStation, ProductionProcess, Item, PurchasedItem, ItemPurchasedItem])],
    providers: [DbPopulateService],
    exports: [DbPopulateService],
})
export class DbPopulateModule {}
