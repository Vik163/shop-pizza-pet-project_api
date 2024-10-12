import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BasketDto } from './dto/basket.dto';
import { BasketTotalDto } from './dto/basket-total.dto';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Users as UsersEntity } from './enities/users.entity';

@Injectable()
export class UserBasketService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  async decreaseBasket(userId: string, id: string): Promise<BasketTotalDto> {
    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });

    if (user) {
      const userBasket = user.basket;
      const product = userBasket.find((i) => i.id === id);
      if (product) {
        product.quantity = product.quantity - 1;
        product.totalPrice = product.price * product.quantity;
      }

      const basketDto = await this.userRepository.save(user);

      if (basketDto) {
        return this.getBasket(userId);
      }
    }
  }

  async deleteBasket(userId: string, id: string): Promise<BasketTotalDto> {
    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });

    if (user) {
      const product = user.basket.filter((i) => i.id !== id);
      this.userRepository.merge(user, {
        basket: product.length > 0 ? product : null,
      });

      const deleteProduct = await this.userRepository.save(user);

      if (deleteProduct) {
        return this.getBasket(userId);
      }
    }
  }

  // Добавляет или меняет товары в корзине =========================
  async addBasket(userId: string, body: BasketDto): Promise<BasketTotalDto> {
    if (userId && body) {
      const user = await this.userRepository.findOne({
        where: {
          userId: userId,
        },
      });
      if (user) {
        const basket = user.basket;

        // Сначала ищет одинаковые продукты
        if (basket && basket.length > 0) {
          const sameProducts = basket.filter((i) => i.image === body.image);

          // если в массиве больше одного, значит есть добавки
          const sameProduct = sameProducts.find((item) => {
            if (body.additives) {
              if (body.additives.length > 0 && item.additives) {
                return (
                  item.additives.toString() === body.additives.toString() &&
                  item.sizePizza === body.sizePizza &&
                  item.dough === body.dough
                );
              } else if (
                body.additives.length === 0 &&
                item.additives.length === 0
              ) {
                return (
                  item.sizePizza === body.sizePizza && item.dough === body.dough
                );
              } else {
                return false;
              }
            } else if (
              !body.additives &&
              (item.additives.length === 0 || item.additives === undefined)
            ) {
              return (
                item.sizePizza === body.sizePizza && item.dough === body.dough
              );
            } else if (!body.additives && item.additives.length > 0) {
              return false;
            }
          });

          if (sameProduct) {
            sameProduct.quantity = sameProduct.quantity
              ? sameProduct.quantity + 1
              : 1;
            sameProduct.totalPrice = body.price * sameProduct.quantity;

            await this.userRepository.save(user);

            // Если редактирование товара в корзине (existingOrderId - id существующего)
            if (body.existingOrderId) {
              // Получаю существующий в корзине товар по id
              const updateProduct: BasketDto = basket.find(
                (i) => i.id === body.existingOrderId,
              );
              // Если единица товара в корзине изменена (отправленный в запросе не равен существующему)
              // То существующий уменьшается, а товар с новыми данными создается или добвляется к такому же
              if (updateProduct !== sameProduct) {
                updateProduct.totalPrice = body.price;

                // удаляется если последний
                if (updateProduct.quantity === 1) {
                  const product = basket.filter(
                    (i) => i.id !== body.existingOrderId,
                  );
                  this.userRepository.merge(user, {
                    basket: product.length > 0 ? product : null,
                  });

                  await this.userRepository.save(user);
                }

                if (updateProduct.quantity > 1) {
                  updateProduct.quantity = updateProduct.quantity - 1;
                  updateProduct.totalPrice =
                    updateProduct.price * updateProduct.quantity;

                  await this.userRepository.save(user);
                }
              }
            }
          } else {
            // добавляет в массив если нет такого
            body.id = uuidv4();
            body.quantity = 1;
            body.totalPrice = body.price;

            user.basket.push(body);
            this.userRepository.merge(user, {
              basket: user.basket,
            });

            await this.userRepository.save(user);
          }
        } else {
          // создает с нуля ====
          body.id = uuidv4();
          body.quantity = 1;
          body.totalPrice = body.price;

          this.userRepository.merge(user, { basket: [body] });

          await this.userRepository.save(user);
        }
      }
    }
    return this.getBasket(userId);
  }

  async getBasket(userId: string): Promise<BasketTotalDto> {
    const user = await this.userRepository.findOne({
      where: { userId },
    });
    const basketProducts: BasketDto[] = user && user.basket;
    let totalPrice = 0;

    if (basketProducts && basketProducts.length > 0) {
      totalPrice = basketProducts.reduce(
        (sum, item) => sum + item.totalPrice,
        totalPrice,
      );
    }

    return { basketProducts, totalPrice };
  }
}
