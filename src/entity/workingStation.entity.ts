import {
    Entity,
    PrimaryColumn,
    ManyToMany,
    JoinTable
} from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class WorkingStation {
    
    @PrimaryColumn()
    public number: number;

    @ManyToMany(() => Item, (item) => item.workingStations)
    @JoinTable()
    public items: Item[];
}