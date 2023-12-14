import { TypeOrmModule } from "@nestjs/typeorm";
import { WaitingList } from "src/entity/waitingList.entity";
import { WaitingListController } from "../controllers/waitingLists.controller";
import { WaitingListService } from "../providers/waitingList.service";
import { Module } from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([WaitingList])],
    controllers: [WaitingListController],
    providers: [WaitingListService]
})
export class WaitingListModule {}