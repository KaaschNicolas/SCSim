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
        this.totalCapacity=0;
        this.shifts=0;
        this.overtime=0;
        this.capacityProductionOrders = [];
        this.capacityWaitingList = [];
        this.capacityOrdersInWork = [];

        return this;
    }

    public addCapacityForProductionOrder(
        itemNumber: number,
        orderAmount: number,
        setupTime: number,
        processingTime: number,
    ): void {
        if (this.capacityProductionOrders === null || this.capacityProductionOrders === undefined) {
            this.capacityProductionOrders = [];
        }
        this.capacityProductionOrders.push(new CapacityForItemDto(itemNumber, orderAmount, setupTime, processingTime));
    }

    public addCapacityForWaitingList(
        itemNumber: number,
        orderAmount: number,
        setupTime: number = 0,
        processingTime: number,
    ): void {
        if (this.capacityWaitingList === null || this.capacityWaitingList === undefined) {
            console.log("if");
            //this.capacityWaitingList = [new CapacityForItemDto(itemNumber, orderAmount, setupTime, processingTime)];
            this.capacityWaitingList = [];
        }
        this.capacityWaitingList.push(new CapacityForItemDto(itemNumber, orderAmount, setupTime, processingTime));
    }

    public addCapacityOrdersInWork(
        itemNumber: number,
        orderAmount: number,
        setupTime: number = 0,
        processingTime: number,
    ): void {
        if (this.capacityOrdersInWork === null || this.capacityOrdersInWork === undefined) {
            this.capacityOrdersInWork = [];
        }
        this.capacityOrdersInWork.push(new CapacityForItemDto(itemNumber, orderAmount, setupTime, processingTime));
    }

    calculateTotalCapacity() {
        let sum: number = 0;
        if (this.capacityProductionOrders !== null || this.capacityProductionOrders !== undefined) {
            this.capacityProductionOrders?.forEach((capacityProductionOrder) => {
                sum += capacityProductionOrder.processingTime + capacityProductionOrder.setupTime;
            });
        }
        if (this.capacityWaitingList !== null || this.capacityWaitingList!== undefined) {
            this.capacityWaitingList?.forEach((capacityWaitingList) => {
                sum += capacityWaitingList.processingTime + capacityWaitingList.setupTime;
            });
        }
        if (this.capacityOrdersInWork !== null || this.capacityWaitingList!== undefined) {
            this.capacityOrdersInWork?.forEach((capacityOrderInWork) => {
                sum += capacityOrderInWork.processingTime + capacityOrderInWork.setupTime;
            });
        }
        this.totalCapacity = sum;
    }

    calculateTotalShiftsAndOvertime() {
        if (this.totalCapacity == 0){
            this.shifts = 0;
        } else if (this.totalCapacity <= 3600) {
            this.shifts = 1;
            if (this.totalCapacity > 2400) {
                this.overtime = this.totalCapacity - 2400;
            }
        } else if (this.totalCapacity <= 6000) {
            this.shifts = 2;
            if (this.totalCapacity > 4800) {
                this.overtime = this.totalCapacity - 4800;
            }
        } else {
            this.shifts = 3;
        }
    }
}
