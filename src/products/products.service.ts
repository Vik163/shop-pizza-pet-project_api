import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// import { CreateCardDto } from '../dto/create-card.dto';
// import { UpdateCardDto } from '../dto/update-card.dto';
import { Pizzas } from './entities/pizzas.entity';
import { Request } from 'express';
import { ReqParamDto } from './dto/req-param.dto';
import { DataBasesProducts } from 'src/consts/nameDataBase';
import { Pagination } from 'src/common/decorators/paginationParams.decorator';
// import { Sorting } from 'src/common/decorators/sortingParams.decorator';
// import { Filtering } from 'src/common/decorators/filteringParams.decorator';
import { PaginatedResource } from './dto/paginate.dto';
import { Repository } from 'typeorm';
import { Drinks } from './entities/drinks.entity';
import { Combos } from './entities/combos.entity';
import { Sauces } from './entities/sauces.entity';
import { Snacks } from './entities/snacks.entity';
import { Product } from './entities/product.entity';
import { Additives } from './entities/additives.entity';
import { Additions } from './entities/additions.entity';

interface ProductsEntities {
  pizzas: Repository<Pizzas>;
  combos: Repository<Snacks>;
  snacks: Repository<Sauces>;
  sauces: Repository<Combos>;
  drinks: Repository<Drinks>;
}

@Injectable()
export class ProductsService {
  private _productsEntities: ProductsEntities;
  constructor(
    @InjectRepository(Pizzas)
    private readonly pizzasRepository: Repository<Pizzas>,
    @InjectRepository(Drinks)
    private readonly drinksRepository: Repository<Drinks>,
    @InjectRepository(Combos)
    private readonly combosRepository: Repository<Combos>,
    @InjectRepository(Sauces)
    private readonly saucesRepository: Repository<Sauces>,
    @InjectRepository(Snacks)
    private readonly snacksRepository: Repository<Snacks>,
    @InjectRepository(Additives)
    private readonly additivesRepository: Repository<Additives>,
    @InjectRepository(Additions)
    private readonly additionsRepository: Repository<Additions>,
  ) {
    this._productsEntities = {
      pizzas: this.pizzasRepository,
      combos: this.combosRepository,
      drinks: this.drinksRepository,
      sauces: this.saucesRepository,
      snacks: this.snacksRepository,
    };
  }

  // async getProducts(req: Request): Promise<Product[]> {
  //   const params: ReqParamDto = req.query;
  //   const viewProduct = params.view || DataBasesProducts.PIZZAS;
  //   console.log('viewProduct:', viewProduct);

  //   return await this._productsEntities[viewProduct].find();
  // }

  async getPopularProducts(): Promise<Product[]> {
    const arr = [];
    for (const key in this._productsEntities) {
      const data = await this._productsEntities[key].find({
        where: { popular: true },
      });
      data.forEach((i: Product) => {
        arr.push(i);
      });
    }
    return arr;
  }

  async getAdditives(): Promise<Additives[]> {
    return await this.additivesRepository.find();
  }

  async getAdditions(): Promise<Product[]> {
    return await this.additionsRepository.find();
  }

  public async getProductsByParams(
    req: Request,
    { page, limit, offset, replace }: Pagination,
    // sort?: Sorting,
    // filter?: Filtering,
  ): Promise<PaginatedResource<Partial<Product[]>>> {
    let hasMore = true;

    const params: ReqParamDto = req.query;
    const viewProduct = params.view || DataBasesProducts.PIZZAS;
    const [data, totalItems] = await this._productsEntities[
      viewProduct
    ].findAndCount({
      take: limit,
      // пропускает ненужные элементы
      skip: offset,
    });

    // настроен, чтобы не было лишнего запроса
    if (offset > totalItems - limit) {
      // останавливает запросы =
      hasMore = false;
    }

    return {
      totalItems: totalItems,
      items: data,
      page,
      hasMore,
      replace,
      view: viewProduct,
    };
  }
}
