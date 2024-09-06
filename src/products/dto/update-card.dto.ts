import { IngredientsViewDto } from './ingredients-view.dto';

export class UpdateCardDto {
  readonly image: string;
  readonly imageAverage: string;
  readonly imageSmall: string;
  readonly description: string;
  readonly title: string;
  readonly type: string;
  readonly addInfo: string;
  readonly popular: boolean;
  readonly price: number[];
  readonly discount: number;
  readonly ingredients?:
    | {
        small: IngredientsViewDto;
        average: IngredientsViewDto;
        big: IngredientsViewDto;
      }
    | IngredientsViewDto;
}
