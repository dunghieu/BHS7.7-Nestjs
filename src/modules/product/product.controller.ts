import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes,
  HttpException,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ObjectId } from 'mongodb';
import { ValidateMongoId } from 'src/pipes/validation.pipe';
import { createReviewDto } from './dto/create-review.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ValidateMongoId) id: string) {
    const product = await this.productService.findOne(id);
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    return product;
  }

  @Patch(':id')
  async update(
    @Param('id', ValidateMongoId) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id', ValidateMongoId) id: string) {
    return await this.productService.remove(id);
  }

  @Post('/:id/review')
  async addReview(
    @Param('id', ValidateMongoId) id: string,
    @Body() review: createReviewDto,
  ) {
    return await this.productService.addReview(id, review);
  }
}
