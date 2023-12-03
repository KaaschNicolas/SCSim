import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
//import { DatabaseModule } from './database/database.module';

//imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
@Module({
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
