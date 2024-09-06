import {
  Column,
  Entity,
  ObjectId,
  ObjectIdColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Order {
  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryColumn()
  product: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: null, nullable: true })
  updatedAt: Date;

  @Column()
  sizePizza: string;

  @Column()
  dough: number[];

  @Column()
  additivesName: string[];

  @Column()
  price: number;
}
