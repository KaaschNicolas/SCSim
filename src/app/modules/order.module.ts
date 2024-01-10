import { DatabaseModule } from "src/database/database.module";
import { OrderController } from "../controllers/order.controller";
import { OrderService } from "../providers/order.service";
import { ItemService } from "../providers/item.service";
import { CapacityService } from "../providers/capacity.service";
import { Module } from "@nestjs/common";

@Module({
    imports: [DatabaseModule,],
    controllers: [OrderController],
    providers: [OrderService, ItemService],
})
export class ItemModule {}