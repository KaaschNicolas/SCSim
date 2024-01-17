import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { ProductionProgram } from 'src/entity/productionProgram.entity';
import { ProductionProgramController } from '../controllers/productionProgram.controller';
import { ProductionProgramService } from '../providers/productionProgram.service';

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([ProductionProgram])],
    controllers: [ProductionProgramController],
    providers: [ProductionProgramService],
})
export class ProductionProgramModule {}
