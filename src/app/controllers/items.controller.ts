import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ItemContainerDto } from '../dto';
import { BomService } from '../providers';

@Controller('items')
export class ItemController {
    constructor(private readonly bomService: BomService) {}

    @Post('/upsertItems')
    upsert(@Body() itemContainerDto: ItemContainerDto) {
        return this.bomService.upsertItems(itemContainerDto);
    }

    @Get('/getCalculatedBom')
    findAll() {
        return this.bomService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bomService.findOne(+id);
    }
}
