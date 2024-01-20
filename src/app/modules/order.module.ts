import { DatabaseModule } from 'src/database/database.module';
import { OrderController } from '../controllers/order.controller';
import { OrderService } from '../providers/order.service';
import { ItemService } from '../providers/item.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/entity/item.entity';
import { WaitingList } from 'src/entity/waitingList.entity';
import { PurchasedItem } from 'src/entity/purchasedItem.entity';
import { ItemPurchasedItem } from 'src/entity/itemPurchasedItem.entity';
import { WaitingListModule } from './waitingList.module';
import { WaitingListService } from '../providers/waitingList.service';
import { PurchasedItemService } from '../providers/purchasedItem.service';
import { ProductionProgram } from 'src/entity/productionProgram.entity';
import { Order } from 'src/entity/order.entity';

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([Item, WaitingList, PurchasedItem, ItemPurchasedItem, ProductionProgram, Order]),
        WaitingListModule,
    ],
    controllers: [OrderController],
    providers: [OrderService, ItemService, WaitingListService, PurchasedItemService],
})
export class OrderModule {}
