import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Basket } from './entities/basket.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { BasketDto } from './dto/basket.dto';
import { BasketTotalDto } from './dto/basket-total.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Basket)
    private readonly basketRepository: Repository<Basket>,
  ) {}

  async addBasket(body: BasketDto): Promise<BasketTotalDto> {
    console.log('body:', body);
    if (body.existingOrderId) {
      const updateProduct = await this.basketRepository.findOne({
        where: {
          id: body.existingOrderId,
        },
      });
      body.totalPrice = body.price;
      if (
        String(body.additives) === String(updateProduct.additives) &&
        body.dough === updateProduct.dough &&
        body.price === updateProduct.price
      ) {
        body.quantity = updateProduct.quantity + 1;
      }

      this.basketRepository.merge(updateProduct, body);

      const data = await this.basketRepository.save(updateProduct);
      if (data) return this.getBasket();
    }

    const sameProducts = await this.basketRepository.find({
      where: {
        image: body.image,
        sizePizza: body.sizePizza || undefined,
        dough: body.dough || undefined,
      },
    });

    const sameProduct =
      sameProducts.length > 1
        ? sameProducts.find((item) => {
            return item.additives.toString() === body.additives.toString();
          })
        : sameProducts[0];

    if (sameProduct) {
      sameProduct.quantity = sameProduct.quantity
        ? sameProduct.quantity + 1
        : 1;
      sameProduct.totalPrice = body.price * sameProduct.quantity;

      const data = await this.basketRepository.save(sameProduct);

      if (data) {
        return this.getBasket();
      }
    } else {
      body.id = uuidv4();
      body.quantity = 1;
      body.totalPrice = body.price;
      const newProduct = this.basketRepository.create(body);

      const basketDto: BasketDto = await this.basketRepository.save(newProduct);

      if (basketDto) {
        return this.getBasket();
      }
    }
  }

  async getBasket(): Promise<BasketTotalDto> {
    const basketProducts: BasketDto[] = await this.basketRepository.find();
    let totalPrice = 0;

    if (basketProducts.length > 0) {
      totalPrice = basketProducts.reduce(
        (sum, item) => sum + item.totalPrice,
        totalPrice,
      );
    }

    return { basketProducts, totalPrice };
  }

  async decreaseBasket(id: string): Promise<BasketTotalDto> {
    const product: BasketDto = await this.basketRepository.findOne({
      where: { id: id },
    });

    if (product) {
      product.quantity = product.quantity - 1;
      product.totalPrice = product.price * product.quantity;
    }

    const basketDto: BasketDto = await this.basketRepository.save(product);

    if (basketDto) {
      return this.getBasket();
    }
  }

  async deleteBasket(id: string): Promise<BasketTotalDto> {
    const product: BasketDto = await this.basketRepository.findOne({
      where: { id: id },
    });
    if (product) {
      const deleteProduct = await this.basketRepository.remove(product);

      if (deleteProduct) {
        return this.getBasket();
      }
    }
  }
}
