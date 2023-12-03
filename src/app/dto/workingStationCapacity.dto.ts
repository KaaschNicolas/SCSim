import { CapacityForItemDto } from "./capacityForItem.dto";

/**
 * DTO zur Übertragung des Kapazitätsbedarfs für eine Arbeitsstation an das Frontend
 */
export class WorkingStationCapacityDto {

    public workingStationNumber: number;

    public capacityProductionOrders?: CapacityForItemDto[];

    public capacityWaitingList?: CapacityForItemDto[];

    public constructor(workingStationNumber: number) {

        this.workingStationNumber = workingStationNumber;

        this.capacityProductionOrders = null;

        this.capacityWaitingList = null;

        return this;
    }

    public addCapacityForItem(itemNumber: number, orderAmount: number, setupTime: number, processingTime: number) : void {
        if (this.capacityProductionOrders == null) {
            this.capacityProductionOrders = [new CapacityForItemDto(itemNumber, orderAmount, processingTime, setupTime)];
        }
        this.capacityProductionOrders.push(new CapacityForItemDto(itemNumber, orderAmount, processingTime, setupTime));
    }
}