import { DataSource } from 'typeorm';
import { Item } from './entity/item.entity';
import { PurchasedItem } from './entity/purchasedItem.entity';
import { WorkingStation } from './entity/workingStation.entity';
import { ProductionProcess } from './entity/productionProcess.entity';

export const AppDataSource = new DataSource({
    type: 'mssql',
    host: 'localhost',
    port: 1433,
    username: 'sa',
    password: 'Test!1234',
    database: 'test',
    synchronize: true,
    logging: true,
    entities: [Item, PurchasedItem, WorkingStation, ProductionProcess],
    subscribers: [],
    migrations: [],
    options: {
        encrypt: false, // for Azure
        trustServerCertificate: true, // true for local dev / self-signed certs
    },
});
