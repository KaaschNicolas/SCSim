import { Body, Controller, Get, HttpCode, Logger, Param, Post } from '@nestjs/common';
import { ItemService } from '../providers/item.service';
import { ItemDto } from '../dto/item.dto';

@Controller('items')
export class ItemController {
    constructor(private readonly itemService: ItemService) {}

    @Post('/upsertItems')
    upsert(@Body() itemDtoList: ItemDto[]) {
        return this.itemService.upsertItems(itemDtoList);
    }

    @Get('getCalculatedBom')
    triggerCalculateBom() {
        return this.itemService.triggerCalculateBom();
    }

    @Get()
    findAll() {
        return this.itemService.getAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.itemService.findById(+id);
    }
}
