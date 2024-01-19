import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ItemModule } from './app/modules/item.module';
import { CapacityModule } from './app/modules/capacity.module';
import { DbPopulateService } from './app/providers/dbPopulate.service';
import { DbPopulateModule } from './app/modules/dbPopulate.module';
import { OrderModule } from './app/modules/order.module';
import { AllInOneModule } from './app/modules/allInOne.module';
import { PurchasedItemsModule } from './app/modules/purchasedItems.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, ItemModule, CapacityModule, DbPopulateModule, OrderModule, AllInOneModule, PurchasedItemsModule],
})
export class AppModule {}
