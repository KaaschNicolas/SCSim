import { ItemDto } from "./item.dto";
import { OrderDto } from "./order.dto";
import { WorkingStationCapacityDto } from "./workingStationCapacity.dto";

export class AllInOneDto {
    public itemList: ItemDto[];

    public workingStationCapacities: WorkingStationCapacityDto[];
    
    public orders: OrderDto[];
}