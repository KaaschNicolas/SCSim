import { ItemContainer } from 'src/entity';
import { ItemDto } from './item.dto';

export class ItemContainerDto {
    public itemList: ItemDto[];

    public toItemContainer(): ItemContainer {
        let itemContainer: ItemContainer;
        this.itemList.forEach((it) => itemContainer.push(it.toItem()));
        return itemContainer;
    }
}
