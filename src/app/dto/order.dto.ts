export class OrderDto {
    
    public article: string; //article object?

    public quantity: number;

    public modus: '5' | '4'; //enum??? bzw. Union Type/ interface oder weitere Werte ergänzen, Union Types sind sehr wahrscheinlich kacke
}