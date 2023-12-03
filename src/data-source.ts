import { DataSource } from 'typeorm';
import WorkingStation, { Item, PurchasedItem } from './entity';

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
});
