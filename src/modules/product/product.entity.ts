import { Type } from 'class-transformer';
import { Max, Min } from 'class-validator';
import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { User } from '../user/user.entity';

export interface IProduct {}

@Entity()
export class Product {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  userId: string;

  // @Column()
  // img: Buffer;

  @Column()
  name: string;

  @Column('number', { default: 0 })
  price: number;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column({ nullable: true, default: [] })
  @Type(() => Review)
  reviews: Review[] = [];

  @Column('number', { default: 0 })
  @Min(0)
  @Max(5)
  rating: number = 0;

  @Column('number', { default: 0 })
  totalReviews: number = 0;
}

@Entity()
class Review {
  @Column()
  name: string;

  @Column()
  rating: number;

  @Column()
  comment: string;

  @Column()
  userId: string;

  @Column('timestamp')
  createdAt: Date;
}
