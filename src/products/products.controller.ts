import { Controller, Get, Logger, Req } from '@nestjs/common';
// import { CreateCardDto } from '../dto/create-card.dto';
// import { UpdateCardDto } from '../dto/update-card.dto';
import { ProductsService } from './products.service';
import { Request } from 'express';
import {
  Pagination,
  PaginationParams,
} from 'src/common/decorators/paginationParams.decorator';
import { PaginatedResource } from './dto/paginate.dto';
import { Product } from './entities/product.entity';
import { Additives } from './entities/additives.entity';
// import { Auth } from 'src/decorators/auth.decorator';
// import { Auth } from 'src/decorators/auth.decorator';

@Controller('products')
export class ProductsController {
  logger: Logger;
  constructor(private readonly productsService: ProductsService) {
    this.logger = new Logger();
  }

  @Get()
  async getProductsByParams(
    @Req() req: Request,

    @PaginationParams() paginationParams: Pagination,
  ): Promise<PaginatedResource<Partial<Product[]>>> {
    return this.productsService.getProductsByParams(req, paginationParams);
  }

  @Get('popular')
  async getPopularProducts(): Promise<Product[]> {
    return this.productsService.getPopularProducts();
  }

  @Get('additives')
  getAdditives(): Promise<Additives[]> {
    return this.productsService.getAdditives();
  }

  @Get('addition_order')
  getAddition(): Promise<Product[]> {
    return this.productsService.getAdditions();
  }
}
