import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/entity/item.entity';
import { ItemPurchasedItem } from 'src/entity/itemPurchasedItem.entity';
import { ProductionProcess } from 'src/entity/productionProcess.entity';
import { ProductionProgram } from 'src/entity/productionProgram.entity';
import { PurchasedItem } from 'src/entity/purchasedItem.entity';
import { WaitingList } from 'src/entity/waitingList.entity';
import { WorkingStation } from 'src/entity/workingStation.entity';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                type: 'mssql',
                entities: [
                    Item,
                    PurchasedItem,
                    WorkingStation,
                    ProductionProcess,
                    ItemPurchasedItem,
                    WaitingList,
                    ProductionProgram,
                ],
                host: config.getOrThrow('SQL_HOST'),
                port: 1433,
                username: config.getOrThrow('SQL_USERNAME'),
                password: config.getOrThrow('SQL_PASSWORD'),
                database: config.getOrThrow('SQL_DATABASE'),
                synchronize: config.getOrThrow('SQL_SYNCHRONIZE'),
                autoLoadEntities: true,
                extra: {
                    trustServerCertificate: true,
                },
            }),
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
