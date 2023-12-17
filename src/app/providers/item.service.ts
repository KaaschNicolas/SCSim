import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/entity/item.entity';
import { ItemContainerDto } from '../dto/itemContainer.dto';

@Injectable()
export class ItemService {
    private readonly logger;

    constructor(
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        private readonly entityManager: EntityManager,
    ) {
        this.logger = new Logger(ItemService.name);
    }

    public async upsertItems(itemContainerDto: ItemContainerDto) {
        this.logger.log('Upserting Items');
        itemContainerDto.itemList.forEach(async (it) => {
            let item = new Item(it);
            await this.entityManager.save(item);
        });
    }

    public async findById(itemNumber: number) {
        return await this.itemRepository.findOneBy({ itemNumber: itemNumber });
    }

    public async findAll() {
        await this.resolveBom();
        return await this.itemRepository.find();
    }

    //TODO Jan und Lukas müssen wissen, dass sie waitingQueue und workInProgress mit angeben
    private async resolveBom() {
        //BOM logic here
        let products = await this.itemRepository.find({
            where: [{ itemNumber: 1 }, { itemNumber: 2 }, { itemNumber: 3 }],
        });

        //productionOrder for p1, p2, p3 must be prefilled (forecast)
        products.forEach(async (item) => {
            await this.resolveChildren(item, item.productionOrder);
        });
    }

    private async resolveChildren(item: Item, parentProdctionOrder: number) {
        if (item.isMultiple) {
            item.productionOrder = parentProdctionOrder;
            item.productionOrder +=
                item.safetyStock - item.warehouseStock / 3 - item.waitingQueue - item.workInProgress;
        } else {
            item.productionOrder = parentProdctionOrder;
            item.productionOrder += item.safetyStock - item.warehouseStock - item.waitingQueue - item.workInProgress;
        }
        await this.entityManager.save(item);

        let childreen = await this.entityManager.getTreeRepository(Item).findDescendants(item);

        childreen.forEach(async (child) => {
            if (child === null) {
                return;
            }

            await this.resolveChildren(child, item.productionOrder);
        });
    }
}