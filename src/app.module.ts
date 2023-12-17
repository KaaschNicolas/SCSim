import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ItemModule } from './app/modules/item.module';
import { CapacityModule } from './app/modules/capacity.module';
import { DbPopulateService } from './app/providers/dbPopulate.service';
import { DbPopulateModule } from './app/modules/dbPopulate.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, BomModule, CapacityModule, DbPopulateModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
