export class ItemDto {
    public itemNumber: number;

    public safetyStock: number;

    public warehouseStock: number;

    public waitingQueue: number;

    public workInProgress: number;

    public productionOrder?: number;

    public isMultiple?: boolean;
}
