import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { FirebaseAdmin } from 'firebaseconfig/firebase.setup';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pizzas } from './entities/pizzas.entity';
import { Drinks } from './entities/drinks.entity';
import { Combos } from './entities/combos.entity';
import { Sauces } from './entities/sauces.entity';
import { Snacks } from './entities/snacks.entity';
import { Additives } from './entities/additives.entity';
import { Additions } from './entities/additions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Drinks,
      Pizzas,
      Combos,
      Sauces,
      Snacks,
      Additives,
      Additions,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, FirebaseAdmin],
})
export class ProductsModule {}
