import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { ProductionProgramService } from '../providers/productionProgram.service';
import { ProductionProgramDto } from '../dto/productionProgram.dto';

@Controller('productionProgram')
export class ProductionProgramController {
    private readonly logger: Logger;

    constructor(private readonly productionProgramService: ProductionProgramService) {
        this.logger = new Logger(ProductionProgramController.name);
    }

    @Post()
    upsertProductionProgram(@Body() productionProgramDtoList: ProductionProgramDto[]) {
        return this.productionProgramService.upsertProductionProgram(productionProgramDtoList);
    }
}
