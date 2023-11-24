import { Injectable } from '@nestjs/common';
import { ForecastDto, ItemContainerDto } from '../dto';


@Injectable()
export class BomService {

    public disolveBom(forecast: ForecastDto, itemContainer: ItemContainerDto): FinalItemContainer {

        itemContainer.itemList.forEach(element => {
            switch (element.itemNumber) {
                case 26:
                    element.productionOrder = forecast.forecastP1 + forecast.forecastP2 + forecast.forecastP3 + element.safetyStock - element.warehouseStock;
                    break;
                case 51:
                    element.productionOrder = forecast.forecastP1;
                case 
                default:
                    break;
            }
        });
    }

    public calculateProductionOrder()
}