/**
 * Produktionsaufträge eines Items pro Arbeitsstation
 */
export class CapacityForItemDto {
    public itemNumber: number;

    public orderAmount: number;

    public processingTime: number;

    public setupTime: number;

    public constructor(itemNumber: number, orderAmount: number, setupTime: number, processingTime: number) {
        this.itemNumber = itemNumber;

        this.orderAmount = orderAmount;

        this.setupTime = setupTime;

        this.processingTime = processingTime;
    }
}
