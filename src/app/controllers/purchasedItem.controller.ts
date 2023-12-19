import { Body, Controller, Post } from '@nestjs/common';
import { PurchasedItemContainerDto } from '../dto/purchasedItemContainer.dto';
import { PurchasedItemService } from '../providers/purchasedItem.service';

@Controller('purchasedItems')
export class PurchasedItemController {
    constructor(private readonly purchasedItemService: PurchasedItemService) {}

    @Post('/upsertPurchasedItems')
    upsert(@Body() purchasedItemContainerDto: PurchasedItemContainerDto) {
        return this.purchasedItemService.upsertPurchasedItems(purchasedItemContainerDto);
    }
}
