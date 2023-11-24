import { Injectable } from '@nestjs/common';
import { ForecastDto, ItemContainerDto, ItemDto } from '../dto';
import { ItemContainer } from 'src/entity';


@Injectable()
export class BomService {

    public disolveBom(forecast: ForecastDto, itemContainer: ItemContainerDto): ItemContainer {

        itemContainer.itemList.forEach(element => {
            switch (element.itemNumber) {
                case 26:
                    element.productionOrder = forecast.forecastP1 + forecast.forecastP2 + forecast.forecastP3 + element.safetyStock - element.warehouseStock;
                    element.isMultiple = true;
                    this.calculateProductionOrder(element, forecast);
                    break;
                case 51:
                    element.productionOrder = forecast.forecastP1;
                case 
                default:
                    break;
            }
        });
    }

    public calculateProductionOrder(itemDto: ItemDto, forecast: ForecastDto) {
        if (itemDto.isMultiple) {
            itemDto
        }
    }
}