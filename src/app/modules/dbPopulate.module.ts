import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { DbPopulateService } from '../providers/dbPopulate.service';
import { WorkingStation } from 'src/entity/workingStation.entity';
import { Module } from '@nestjs/common';
import { ProductionProcess } from 'src/entity/productionProcess.entity';
import { Item } from 'src/entity/item.entity';
import { PurchasedItem } from 'src/entity/purchasedItem.entity';
import { ItemPurchasedItem } from 'src/entity/itemPurchasedItem.entity';
import { WaitingList } from 'src/entity/waitingList.entity';
import { FutureOrder } from 'src/entity/futureOrder.entity';

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([
            WorkingStation,
            ProductionProcess,
            Item,
            PurchasedItem,
            ItemPurchasedItem,
            WaitingList,
            FutureOrder,
        ]),
    ],
    providers: [DbPopulateService],
    exports: [DbPopulateService],
})
export class DbPopulateModule {}
