import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { BomModule } from './app/modules/bom.module';
import { CapacityModule } from './app/modules/capacity.module';
import { ProviderModule } from './app/providers/provider.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, BomModule, CapacityModule],
    controllers: [AppController],
    providers: [ProviderModule],
})
export class AppModule {}
