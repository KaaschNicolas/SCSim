import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ItemModule } from './app/modules/item.module';
import { CapacityModule } from './app/modules/capacity.module';
import { ProviderModule } from './app/providers/provider.module';
import { ItemController } from './app/controllers/items.controller';
import { ItemService } from './app/providers/item.service';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, ItemModule, CapacityModule],
    controllers: [ItemController],
    providers: [ProviderModule, ItemService],
})
export class AppModule {}
