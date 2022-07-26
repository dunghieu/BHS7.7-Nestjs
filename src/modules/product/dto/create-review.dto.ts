import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsMongoId, IsString, Max, Min } from 'class-validator';

export class createReviewDto {
  @ApiProperty()
  @IsMongoId()
  userId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @ApiProperty()
  @IsString()
  comment?: string;

  @ApiProperty()
  @IsString()
  email: string;
}
