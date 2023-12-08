import { CapacityForItemDto } from './capacityForItem.dto';

/**
 * DTO zur Übertragung des Kapazitätsbedarfs für eine Arbeitsstation an das Frontend
 */
export class WorkingStationCapacityDto {
    public workingStationNumber: number;

    public totalCapacity?: number;

    public shifts?: number;

    public overtime?: number;

    public capacityProductionOrders?: CapacityForItemDto[];

    public capacityWaitingList?: CapacityForItemDto[];

    public capacityOrdersInWork?: CapacityForItemDto[];

    public constructor(workingStationNumber: number) {
        this.workingStationNumber = workingStationNumber;

        return this;
    }

    public addCapacityForProductionOrder(
        itemNumber: number,
        orderAmount: number,
        setupTime: number,
        processingTime: number,
    ): void {
        if (this.capacityProductionOrders === null) {
            this.capacityProductionOrders = [
                new CapacityForItemDto(itemNumber, orderAmount, setupTime, processingTime),
            ];
        }
        this.capacityProductionOrders.push(new CapacityForItemDto(itemNumber, orderAmount, setupTime, processingTime));
    }

    public addCapacityForWaitingList(
        itemNumber: number,
        orderAmount: number,
        setupTime: number = 0,
        processingTime: number,
    ): void {
        if (this.capacityWaitingList === null) {
            this.capacityWaitingList = [new CapacityForItemDto(itemNumber, orderAmount, setupTime, processingTime)];
        }
        this.capacityWaitingList.push(new CapacityForItemDto(itemNumber, orderAmount, setupTime, processingTime));
    }

    public addCapacityOrdersInWork(
        itemNumber: number,
        orderAmount: number,
        setupTime: number = 0,
        processingTime: number,
    ): void {
        if (this.capacityOrdersInWork === null) {
            this.capacityOrdersInWork = [new CapacityForItemDto(itemNumber, orderAmount, setupTime, processingTime)];
        }
        this.capacityOrdersInWork.push(new CapacityForItemDto(itemNumber, orderAmount, setupTime, processingTime));
    }

    calculateTotalCapacity() {
        let sum: number = 0;
        if (this.capacityProductionOrders !== null) {
            this.capacityProductionOrders.forEach((capacityProductionOrder) => {
                sum += capacityProductionOrder.processingTime + capacityProductionOrder.setupTime;
            });
        }
        if (this.capacityWaitingList !== null) {
            this.capacityWaitingList.forEach((capacityWaitingList) => {
                sum += capacityWaitingList.processingTime + capacityWaitingList.setupTime;
            });
        }
        if (this.capacityOrdersInWork !== null) {
            this.capacityOrdersInWork.forEach((capacityOrderInWork) => {
                sum += capacityOrderInWork.processingTime + capacityOrderInWork.setupTime;
            });
        }
    }

    calculateTotalShiftsAndOvertime() {
        if (this.totalCapacity <= 3600) {
            this.shifts = 1;
            if (this.totalCapacity > 2400) {
                this.overtime = this.totalCapacity - 2400;
            }
        } else if (this.totalCapacity <= 6000) {
            this.shifts = 2;
            if (this.totalCapacity > 4800) {
                this.overtime = this.totalCapacity - 4800;
            }
        } else if (this.totalCapacity <= 8400) {
            this.shifts = 3;
            if (this.totalCapacity > 7200) {
                this.overtime = this.totalCapacity - 7200;
            }
        }
    }
}
