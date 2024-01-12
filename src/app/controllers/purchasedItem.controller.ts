import { Body, Controller, Post } from '@nestjs/common';
import { PurchasedItemContainerDto } from '../dto/purchasedItemContainer.dto';
import { PurchasedItemService } from '../providers/purchasedItem.service';
import { PurchasedItemDto } from '../dto/purchasedItem.dto';

@Controller('purchasedItems')
export class PurchasedItemController {
    constructor(private readonly purchasedItemService: PurchasedItemService) {}

    @Post('/upsertPurchasedItems')
    upsert(@Body() purchasedItemDtoList: PurchasedItemDto[]) {
        return this.purchasedItemService.upsertPurchasedItems(purchasedItemDtoList);
    }
}
