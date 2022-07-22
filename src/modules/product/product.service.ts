import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { momentConstants } from '../../constants/moment.constant';
import { ProductNotFoundException } from '../../exceptions/product-not-found.exception';
import { ObjectID, MongoRepository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import * as mom from 'moment';
const moment = require('moment').default || require('moment');

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
    product.userId = createProductDto.userId;
    return this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find({});
  }

  findOne(id: string) {
    try {
      return this.productRepository.findOneBy({
        _id: new ObjectId(id),
      });
    } catch (e) {
      throw new ProductNotFoundException();
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    if (!product) throw new ProductNotFoundException();
    return this.productRepository.update(product, updateProductDto);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    if (!product) throw new ProductNotFoundException();
    return this.productRepository.delete(product);
  }

  async addReview(id: string, review: any) {
    const product = await this.findOne(id);
    if (!product) throw new ProductNotFoundException();
    review = {
      email: review.email,
      rating: review.rating,
      comment: review.comment,
      userId: review.userId,
      createdAt: moment().format(momentConstants.DATE_TIME_FORMAT),
    };
    product.reviews.push(review);
    product.totalReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, cur) => cur.rating + acc, 0) /
      product.totalReviews;
    return this.productRepository.save(product);
  }
}
