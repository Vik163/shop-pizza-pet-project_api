import { BasketDto } from './basket.dto';

export class BasketTotalDto {
  basketProducts: BasketDto[];
  totalPrice: number;
}
