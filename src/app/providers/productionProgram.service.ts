import { ProductionProgram } from 'src/entity/productionProgram.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ProductionProgramDto } from '../dto/productionProgram.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ProductionProgramService {
    private readonly logger: Logger;

    constructor(
        @InjectRepository(ProductionProgram)
        private readonly productionProgramRepository: Repository<ProductionProgram>,
        private readonly entityManager: EntityManager,
    ) {
        this.logger = new Logger(ProductionProgramService.name);
    }

    public async upsertProductionProgram(productionProgram: ProductionProgramDto[]) {
        return await this.entityManager.save(productionProgram);
    }
}
