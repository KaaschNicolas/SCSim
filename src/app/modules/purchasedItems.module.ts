import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasedItem } from 'src/entity/purchasedItem.entity';
import { PurchasedItemController } from '../controllers/purchasedItem.controller';
import { PurchasedItemService } from '../providers/purchasedItem.service';

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([PurchasedItem])],
    controllers: [PurchasedItemController],
    providers: [PurchasedItemService]
})
export class PurchasedItemsModule {}