import { DataSource } from 'typeorm';
import { Item, PurchasedItem, WorkingStation } from './entity';

export const AppDataSource = new DataSource({
    type: 'mssql',
    host: 'localhost',
    port: 1433,
    username: 'sa',
    password: 'Nicolas!1234',
    database: 'test',
    synchronize: true,
    logging: true,
    entities: [Item, PurchasedItem, WorkingStation],
    subscribers: [],
    migrations: [],
    options: {
        encrypt: false, // for Azure
        trustServerCertificate: true, // true for local dev / self-signed certs
    },
});
