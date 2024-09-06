type ProductView = 'pizzas' | 'combos' | 'snacks' | 'sauces' | 'drinks';

export class ReqParamDto {
  readonly _expand?: string;
  readonly page?: number;
  readonly limit?: number;
  readonly hasMore?: boolean;
  readonly view?: ProductView;
  readonly sort?: string;
  readonly search?: string;
  readonly type?: string;
  readonly _inited?: boolean;
}
