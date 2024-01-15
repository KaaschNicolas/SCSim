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

    public mergeAndReplaceItems(itemNumbersToMerge: number[], newItemNumber: number): void {
        let totalOrderAmount = 0;
        let totalProcessingTime = 0;
        let setupTime = 0;
        let foundFirstItem = false;
        
        // Filtern und Zusammenführen der Werte
        const filteredItems = this.capacityProductionOrders.filter(item => {
            if (itemNumbersToMerge.includes(item.itemNumber)) {
                totalOrderAmount += item.orderAmount;
                console.log(totalOrderAmount);
                totalProcessingTime += item.processingTime;
                if (!foundFirstItem) {
                    setupTime = item.setupTime ?? 0;
                    foundFirstItem = true;
                }
                return false; // Entferne das Element aus dem Array
            }
            return true; // Behalte das Element im Array
        });

        // Erstellen des neuen Objekts und Hinzufügen zum Array
        if(totalOrderAmount > 0) {
            const mergedItem = new CapacityForItemDto(newItemNumber, totalOrderAmount, setupTime, totalProcessingTime);
            filteredItems.push(mergedItem);
        }

        this.capacityProductionOrders = filteredItems;
    }  

    public concatenateMultipleItems(numberToConcatenate: number, newNumber: number){
        this.capacityWaitingList.forEach(capacity => {
            if (capacity.itemNumber == numberToConcatenate) {
                capacity.itemNumber = newNumber;
            }
        });
        this.capacityOrdersInWork.forEach(capacity => {
            if (capacity.itemNumber == numberToConcatenate) {
                capacity.itemNumber = newNumber;
            }
        });
    }

    calculateTotalCapacity() {
        this.mergeAndReplaceItems([161, 162, 163], 16);
        this.mergeAndReplaceItems([171, 172, 173], 17);
        this.mergeAndReplaceItems([261, 262, 263], 26);
        this.concatenateMultipleItems(161, 16);
        this.concatenateMultipleItems(171, 17);
        this.concatenateMultipleItems(261, 26);
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
                this.overtime = (this.totalCapacity - 2400)/5;
            }
        } else if (this.totalCapacity <= 6000) {
            this.shifts = 2;
            if (this.totalCapacity > 4800) {
                this.overtime = (this.totalCapacity - 4800)/5;
            }
        } else {
            this.shifts = 3;
        }
    }
}
