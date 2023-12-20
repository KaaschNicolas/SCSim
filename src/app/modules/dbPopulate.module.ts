import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { DbPopulateService } from '../providers/dbPopulate.service';
import { WorkingStation } from 'src/entity/workingStation.entity';
import { Module } from '@nestjs/common';
import { ProductionProcess } from 'src/entity/productionProcess.entity';
import { Item } from 'src/entity/item.entity';

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([WorkingStation, ProductionProcess, Item])],
    providers: [DbPopulateService],
    exports: [DbPopulateService],
})
export class DbPopulateModule {}
