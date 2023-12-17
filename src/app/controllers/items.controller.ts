import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ItemService } from '../providers/item.service';
import { ItemContainerDto } from '../dto/itemContainer.dto';

@Controller('items')
export class ItemController {
    constructor(private readonly itemService: ItemService) {}

    @Post('/upsertItems')
    upsert(@Body() itemContainerDto: ItemContainerDto) {
        return this.itemService.upsertItems(itemContainerDto);
    }

    @Get('/getCalculatedBom')
    findAll() {
        return this.itemService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.itemService.findById(+id);
    }
}
