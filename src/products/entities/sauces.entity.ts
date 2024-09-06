import { Entity } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Sauces extends Product {}
