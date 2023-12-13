import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProductionProcess } from 'src/entity/productionProcess.entity';
import { WorkingStation } from 'src/entity/workingStation.entity';
import { WorkingStationCapacityController } from '../controllers/workingStationCapacity.controller';
import { WaitingListController } from '../controllers/waitingLists.controller';
import { CapacityService } from '../providers/capacity.service';
import { Item } from 'src/entity/item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaitingList } from 'src/entity/waitingList.entity';

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([Item, ProductionProcess, WorkingStation, WaitingList])],
    controllers: [WorkingStationCapacityController],
    providers: [CapacityService]
})
export class CapacityModule {}