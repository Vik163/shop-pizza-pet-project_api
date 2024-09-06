import { ObjectId } from 'mongoose';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class Action {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  image: string;

  @Column()
  imageSmall: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  link: string;
}
