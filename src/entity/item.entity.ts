import {
    Entity,
    Column,
    PrimaryColumn,
    Tree,
    TreeChildren,
    TreeParent,
    JoinTable,
    ManyToMany
} from 'typeorm';
import { WorkingStation } from './workingStation.entity';
import { PurchasedItem } from './purchasedItem.entity';

@Entity()
@Tree()
export class Item {
    
    @PrimaryColumn()
    public itemNumber: number;

    @Column()
    public safetyStock: number;

    @Column()
    public warehouseStock: number;

    @Column()
    public waitingQueue: number;

    @Column()
    public workInProgress: number;

    @Column()
    public productionOrder?: number;

    @Column()
    public isMultiple?: boolean;

    @TreeChildren
    public consistsOf: Item[];

    @TreeParent
    public parentItem: Item;

    @ManyToMany(() => WorkingStation, (workingStation) => workingStation.items)
    public workingStations: WorkingStation[];

    @ManyToMany(() => PurchasedItem, (purchasedItem) => purchasedItem.items)
    @JoinTable()
    public purchasedItems: PurchasedItem[];
}
