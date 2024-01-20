import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasedItem } from 'src/entity/purchasedItem.entity';
import { PurchasedItemController } from '../controllers/purchasedItem.controller';
import { PurchasedItemService } from '../providers/purchasedItem.service';
import { ItemPurchasedItem } from 'src/entity/itemPurchasedItem.entity';
import { ProductionProgram } from 'src/entity/productionProgram.entity';

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([PurchasedItem, ItemPurchasedItem, ProductionProgram])],
    controllers: [PurchasedItemController],
    providers: [PurchasedItemService],
})
export class PurchasedItemsModule {}
