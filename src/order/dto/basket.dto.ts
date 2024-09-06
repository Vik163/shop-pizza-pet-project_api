import { Product } from 'src/products/entities/product.entity';

export class BasketDto {
  id: string;
  readonly product: Product;
  readonly image: string;
  readonly sizePizza?: string;
  readonly dia?: number;
  readonly dough?: string;
  readonly existingOrderId?: string;
  readonly additives?: string[];
  totalPrice: number;
  price: number;
  quantity?: number;
}
