import { Item } from 'src/entity/item.entity';

/* eslint-disable prettier/prettier */
export class ItemDto {
    public itemNumber: number;

    public safetyStock: number;

    public warehouseStock: number;

    public waitingQueue?: number;

    public workInProgress?: number;

    public productionOrder?: number;

    public description?: string;

    public isMultiple?: boolean;

    public toItem(): Item {
        return {
            itemNumber: this.itemNumber,
            safetyStock: this.safetyStock,
            warehouseStock: this.warehouseStock,
            waitingQueue: this.waitingQueue,
            productionOrder: this.productionOrder,
            isMultiple: this.isMultiple,
            workInProgress: this.workInProgress,
            consistsOf: null,
            parentItem: null,
            productionProcesses: null,
            itemPurchasedItems: null,
        };
    }

    constructor(
        itemNumber: number,
        safteyStock: number,
        warehouseStock: number,
        productionOrder: number,
        waitingQueue: number,
        workInProgress: number,
        description: string,
    ) {
        (this.itemNumber = itemNumber),
            (this.safetyStock = safteyStock),
            (this.warehouseStock = warehouseStock),
            (this.waitingQueue = waitingQueue),
            (this.productionOrder = productionOrder),
            (this.description = description),
            (this.workInProgress = workInProgress);
    }
}
