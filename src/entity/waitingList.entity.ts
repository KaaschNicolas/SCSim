import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class WaitingList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    public itemId: number;

    @Column()
    public workingStationId: number;

    @Column()
    public amount: number;

    @Column()
    public timeNeed: number;

    @Column()
    public isInWork: boolean;

    constructor(waitingList: Partial<WaitingList>) {
        Object.assign(this, waitingList);
    }
}
