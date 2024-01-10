import { Module } from "@nestjs/common";
import { AllInOneController } from "../controllers/allInOne.controller";
import { AllInOneService } from "../providers/allInOne.service";
import { CapacityModule } from "./capacity.module";
import { ItemModule } from "./item.module";
import { OrderModule } from "./order.module";
import { DatabaseModule } from "src/database/database.module";
import { ItemService } from "../providers/item.service";
import { CapacityService } from "../providers/capacity.service";
import { OrderService } from "../providers/order.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item } from "src/entity/item.entity";
import { WaitingListService } from "../providers/waitingList.service";
import { WorkingStation } from "src/entity/workingStation.entity";
import { WaitingList } from "src/entity/waitingList.entity";
import { ProductionProcess } from "src/entity/productionProcess.entity";
import { ItemPurchasedItem } from "src/entity/itemPurchasedItem.entity";
import { PurchasedItem } from "src/entity/purchasedItem.entity";

@Module({
    imports: [ DatabaseModule, TypeOrmModule.forFeature([Item, WorkingStation, WaitingList, ProductionProcess, PurchasedItem, ItemPurchasedItem]), OrderModule, ItemModule, CapacityModule],
    controllers: [AllInOneController],
    providers: [AllInOneService, ItemService, CapacityService, OrderService, WaitingListService],
})
export class AllInOneModule {}