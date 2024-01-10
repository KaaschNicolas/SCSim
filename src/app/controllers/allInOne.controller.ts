import { Controller, Get } from "@nestjs/common";
import { AllInOneService } from "../providers/allInOne.service";

@Controller('allInOne')
export class AllInOneController {

    constructor(
        private readonly allInOneService: AllInOneService,
    ) {}

    @Get()
    public async GetAllInOne() {
        return await this.allInOneService.provideAllInOne();
    }
}