import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { ObjectId } from 'mongodb';
import { MongoRepository, ObjectID } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: MongoRepository<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const product = new Product();
    product.name = createProductDto.name;
    product.price = createProductDto.price;
    product.description = createProductDto.description;
    product.userId = createProductDto.userID;
    return this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find({});
  }

  findOne(id: string) {
    return this.productRepository.findOneBy({
      _id: new ObjectId(id),
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    return this.productRepository.update(product, updateProductDto);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    return this.productRepository.delete(product);
  }

  async addReview(id: string, review: any) {
    const product = await this.findOne(id);
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    review = {
      email: review.email,
      rating: review.rating,
      comment: review.comment,
      userId: review.userId,
      createdAt: moment().format('HH:mm:ss DD-MM-YYYY'),
    };
    product.reviews.push(review);
    product.totalReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, cur) => cur.rating + acc, 0) /
      product.totalReviews;
    return this.productRepository.save(product);
  }
}
