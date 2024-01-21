import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchasedItem } from 'src/entity/purchasedItem.entity';
import { PurchasedItemDto } from '../dto/purchasedItem.dto';
import { ItemPurchasedItem } from 'src/entity/itemPurchasedItem.entity';
import { ProductionProgram } from 'src/entity/productionProgram.entity';

@Injectable()
export class PurchasedItemService {
    private readonly logger;

    constructor(
        @InjectRepository(PurchasedItem)
        private readonly purchasedItemsRepository: Repository<PurchasedItem>,
        @InjectRepository(ItemPurchasedItem)
        private readonly itemPurchasedItemRepository: Repository<ItemPurchasedItem>,
        @InjectRepository(ProductionProgram)
        private readonly productionProgramRepository: Repository<ProductionProgram>,
        private readonly entityManager: EntityManager,
    ) {
        this.logger = new Logger();
    }

    public async upsertPurchasedItems(purchasedItemDtoList: PurchasedItemDto[]) {
        this.logger.log('upsertPurchasedItems');
        purchasedItemDtoList.forEach(async (it) => {
            let purchasedItem = new PurchasedItem(it);
            await this.purchasedItemsRepository.save(purchasedItem);
        });
    }

    public async calcNeedsForWeek(purchasedItemDto: PurchasedItemDto) {
        let purchasedItem = await this.purchasedItemsRepository.findOne({
            where: {
                number: purchasedItemDto.number,
            }
        });

        let itemPurchasedItems = await this.itemPurchasedItemRepository.find({
            where: {
                purchasedItem: purchasedItem,
            },
            relations: {
                purchasedItem: true,
                item: true,
            },
        });

        let productionPrograms = await this.productionProgramRepository.find();

        let needPerWeek: Array<number> = new Array<number>();

        for (let pp of productionPrograms) {
            let value = 0;
            for (let ipi of itemPurchasedItems) {
                if (ipi.item.itemNumber == 1) {
                    value += ipi.item.productionOrder * ipi.multiplier * pp.amountP1;
                }
                if (ipi.item.itemNumber == 2) {
                    value += ipi.item.productionOrder * ipi.multiplier * pp.amountP2;
                }
                if (ipi.item.itemNumber == 3) {
                    value += ipi.item.productionOrder * ipi.multiplier * pp.amountP3;
                }
            }
            needPerWeek.push(value);
        }
        return needPerWeek;
    }
}
