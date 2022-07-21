import { NotFoundException } from '@nestjs/common';
import { productConstants } from '../constants/product.constant';

export class ProductNotFoundException extends NotFoundException {
  constructor() {
    super(productConstants.NOT_FOUND);
  }
}
