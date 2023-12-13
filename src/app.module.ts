import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ControllerModule } from './app/controllers/controller.module';
import { ProviderModule } from './app/providers/provider.module';
import { EntityModule } from './entity/entity.module';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, EntityModule],
    controllers: [AppController, ControllerModule],
    providers: [AppService, ProviderModule],
})
export class AppModule {}
