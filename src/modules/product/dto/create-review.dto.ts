import { Type } from 'class-transformer';
import { IsInt, IsMongoId, IsString, Max, Min } from 'class-validator';

export class createReviewDto {
  @IsMongoId()
  userId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @IsString()
  comment: string;

  @IsString()
  email: string;
}
