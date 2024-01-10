import { Module } from "@nestjs/common";
import { AllInOneController } from "../controllers/allInOne.controller";
import { AllInOneService } from "../providers/allInOne.service";
import { CapacityModule } from "./capacity.module";
import { ItemModule } from "./item.module";
import { OrderModule } from "./order.module";

@Module({
    imports: [ OrderModule, ItemModule, CapacityModule],
    controllers: [AllInOneController],
    providers: [AllInOneService],
})
export class AllInOneModule {}