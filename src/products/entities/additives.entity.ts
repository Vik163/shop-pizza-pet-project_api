import { ObjectId } from 'mongoose';
import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Additives {
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
  price: number[];
}
