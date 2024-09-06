import { ObjectId } from 'mongoose';
import { IngredientsViewDto } from 'src/products/dto/ingredients-view.dto';
import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import { IngredientsDto } from '../dto/ingredients.dto';

@Entity()
export class Product {
  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryColumn()
  title: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: null, nullable: true })
  updatedAt: Date;

  @Column()
  image: string;

  @Column()
  imageSmall: string;

  @Column()
  imageAverage: string;

  @Column()
  description: string;

  @Column()
  addInfo: string;

  @Column()
  type: string;

  @Column()
  price: number[];

  @Column()
  discount: number;

  @Column()
  popular: boolean;

  @Column()
  ingredients?: IngredientsDto | IngredientsViewDto;
}
