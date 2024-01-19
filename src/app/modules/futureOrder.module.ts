import { FutureOrder } from "src/entity/futureOrder.entity";
import { FutureOrderController } from "../controllers/futureOrder.controller";
import { FutureOrderService } from "../providers/futureOrder.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "src/database/database.module";
import { Module } from "@nestjs/common";
import { PurchasedItem } from "src/entity/purchasedItem.entity";

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([FutureOrder, PurchasedItem])],
    controllers: [FutureOrderController],
    providers: [FutureOrderService],
})
export class FuturOrderModule {}