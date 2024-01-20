import { ProductionProgram } from 'src/entity/productionProgram.entity';

export class PurchasedItemDto {
    public number: number;

    public ordertype: number;

    public warehouseStock: number;

    public costs: number;

    public calculatedPurchase: number;

    public deliverytime: number;

    public deviation: number;

    public discountQuantity: number;

    public stockHistory: Map<number, number>;
}
