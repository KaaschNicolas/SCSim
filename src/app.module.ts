import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { BomModule } from './app/modules/bom.module';
import { CapacityModule } from './app/modules/capacity.module';
import { ProviderModule } from './app/providers/provider.module';
import { ItemController } from './app/controllers/items.controller';
import { BomService } from './app/providers/bom.service';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, BomModule, CapacityModule],
    controllers: [ItemController],
    providers: [ProviderModule, BomService],
})
export class AppModule {}
