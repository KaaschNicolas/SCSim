import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { ProductionProcess } from './productionProcess.entity';
import { PurchasedItem } from './purchasedItem.entity';
import { WorkingStation } from './workingStation.entity';
import { Module } from '@nestjs/common';
import { WaitingList } from './waitingList.entity';
import { ItemPurchasedItem } from './itemPurchasedItem.entity';
import { Order } from './order.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Item,
            ProductionProcess,
            PurchasedItem,
            WorkingStation,
            WaitingList,
            ItemPurchasedItem,
            Order,
        ]),
    ],
    exports,
})
export class EntityModule {}
