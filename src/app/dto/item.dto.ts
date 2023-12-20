import { Item } from 'src/entity/item.entity';

/* eslint-disable prettier/prettier */
export class ItemDto {
    public itemNumber: number;

    public safetyStock: number;

    public warehouseStock: number;

    public waitingQueue?: number;

    public workInProgress?: number;

    public productionOrder?: number;

    public isMultiple?: boolean;

    public toItem(): Item {
        return {
            itemNumber: this.itemNumber,
            safetyStock: this.safetyStock,
            warehouseStock: this.warehouseStock,
            waitingQueue: this.waitingQueue,
            productionOrder: this.productionOrder,
            isMultiple: this.isMultiple,
            workInProgress: null,
            consistsOf: null,
            parentItem: null,
            productionProcesses: null,
            itemPurchasedItems: null,
        };
    }
}
