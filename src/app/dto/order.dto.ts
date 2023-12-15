import { PurchasedItem } from 'src/entity/purchasedItem.entity';

export class OrderDto {
    public article: number;

    public quantity: number;

    public modus: '4' | '5';
}
