import { Module } from '@nestjs/common';
import { FirebaseAdmin } from 'firebaseconfig/firebase.setup';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users as UsersEntity } from './enities/users.entity';
import { Basket } from './enities/basket.entity';
import { UserBasketController } from './userBasket.controller';
import { UserBasketService } from './userBasket.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, Basket])],
  controllers: [UserController, UserBasketController],
  providers: [UserService, FirebaseAdmin, UserBasketService],
})
export class UserModule {}
