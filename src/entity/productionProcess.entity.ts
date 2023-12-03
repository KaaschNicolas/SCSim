import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    PrimaryColumn,
    Tree,
    TreeChildren,
    TreeParent,
    JoinTable,
    ManyToOne,
} from 'typeorm';
import { Item } from './item.entity';
import { WorkingStation } from './workingStation.entity';

/**
 ** Diese Entity dient als Brückentabelle zwischen Item und workingStation mit custom properties um Informationen wie Bearbeitungszeit und Rüstzeit zu Bererechnen
 */

@Entity()
export class ProductionProcess {
    @PrimaryGeneratedColumn()
    public productionprocessId: number;

    @Column()
    public itemId: number;

    @Column()
    public workingStationId: number;

    @Column()
    public setupTime: number;

    @Column()
    public processingTime: number;

    @ManyToOne(() => Item, (item) => item.productionProcesses)
    public item: Item;

    @ManyToOne(() => WorkingStation, (workingStation) => workingStation.productionProcesses)
    public workingStation: WorkingStation;
}
