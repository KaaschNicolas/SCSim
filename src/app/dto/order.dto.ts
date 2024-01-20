import { PurchasedItem } from 'src/entity/purchasedItem.entity';

export class OrderDto {
    public article: number;

    public quantity: number;

    public modus: '4' | '5';

    public description: string;
    
    constructor(
        article: number,
        quantity: number,
        modus: '4' | '5',
        description: string,
    ) {
        (this.article = article),
        (this.quantity = quantity),
        (this.modus = modus),
        (this.description = description);
    }
}
