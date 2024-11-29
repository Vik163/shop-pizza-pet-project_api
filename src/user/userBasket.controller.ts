import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserBasketService } from './userBasket.service';
import { BasketDto } from './dto/basket.dto';
import { BasketTotalDto } from './dto/basket-total.dto';
import { AccessToken } from 'src/common/decorators/accessToken.decorator';

@Controller('users')
export class UserBasketController {
  constructor(private basketService: UserBasketService) {}

  @AccessToken()
  @Post(':userId/basket')
  async addBasket(
    @Param('userId') userId: string,
    @Body() body: BasketDto,
  ): Promise<BasketTotalDto> {
    return await this.basketService.addBasket(userId, body);
  }

  @AccessToken()
  @Get(':userId/basket')
  async getBasket(@Param('userId') userId: string): Promise<BasketTotalDto> {
    return this.basketService.getBasket(userId);
  }

  @AccessToken()
  @Put(':userId/basket/:id')
  async decreaseBasket(
    @Param('userId') userId: string,
    @Param('id') id: string,
  ): Promise<BasketTotalDto> {
    return this.basketService.decreaseBasket(userId, id);
  }

  @AccessToken()
  @Delete(':userId/basket/:id')
  async deleteBasket(
    @Param('userId') userId: string,
    @Param('id') id: string,
  ): Promise<BasketTotalDto> {
    return this.basketService.deleteBasket(userId, id);
  }
}
