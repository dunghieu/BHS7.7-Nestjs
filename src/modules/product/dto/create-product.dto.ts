import { Type } from 'class-transformer';
import { IsEmpty, IsInt, IsMongoId, IsString } from 'class-validator';

export class CreateProductDto {
  @IsMongoId()
  userID: string;

  @IsString()
  name: string;

  @IsInt()
  @Type(() => Number)
  price: number;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsEmpty()
  reviews: any[];

  @IsEmpty()
  totalReviews: number;

  @IsEmpty()
  rating: number;
}
