import { Product } from '../../src/modules/product/product.entity';
import { ProductService } from '../../src/modules/product/product.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../../src/modules/product/product.controller';
import { CreateProductDto } from '../../src/modules/product/dto/create-product.dto';
import { ValidateMongoId } from '../../src/pipes/validation.pipe';
import { ProductNotFoundException } from '../../src/exceptions/product-not-found.exception';
import {
  ArgumentMetadata,
  HttpException,
  ValidationPipe,
} from '@nestjs/common';
import { createReviewDto } from '../../src/modules/product/dto/create-review.dto';

describe('ProductController', () => {
  let productService: any;
  let productController: ProductController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            addReview: jest.fn(),
          },
        },
        CreateProductDto,
      ],
    }).compile();
    productService = moduleRef.get<ProductService>(ProductService);
    productController = moduleRef.get<ProductController>(ProductController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  let target: ValidationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
  });

  let targetId: ValidateMongoId = new ValidateMongoId();
  const metadataBody: ArgumentMetadata = {
    type: 'body',
    metatype: CreateProductDto,
    data: '',
  };
  const metadataParams: ArgumentMetadata = {
    type: 'param',
    metatype: ValidateMongoId,
    data: 'id',
  };

  describe('Create', () => {
    it('should create a product', async () => {
      const product = new Product();
      const dto: CreateProductDto = {
        ...product,
        name: 'test',
        price: 1,
        description: 'test',
        userId: 'test',
      };
      productService.create.mockReturnValue(dto);
      expect(await productController.create(dto)).toEqual(dto);
    });

    it('should throw an error message if the product is missing required fields', async () => {
      const dto = {};
      await target
        .transform(<CreateProductDto>dto, metadataBody)
        .catch((err) => {
          expect(err.getResponse().message).toEqual([
            'userId must be a mongodb id',
            'name must be a string',
            'price must be an integer number',
            'description must be a string',
            'category must be a string',
          ]);
        });
    });
  });

  describe('FindAll', () => {
    it('should return all products', async () => {
      const products = [new Product()];
      productService.findAll.mockReturnValue(products);
      expect(await productController.findAll()).toEqual(products);
    });
  });

  describe('FindOne', () => {
    it('should return a product', async () => {
      const id = '62df82997d5db3aa7cf4cc53';
      const product = new Product();
      productService.findOne.mockReturnValue(product);
      expect(await productController.findOne(id)).toEqual(product);
    });

    it('should throw an error message if the product is not found', async () => {
      const id = '62df82997d5db3aa7cf4cc53';
      productService.findOne.mockReturnValue(null);
      await expect(productController.findOne(id)).rejects.toEqual(
        new HttpException('Product not found', 404),
      );
    });

    it('should throw an error message if invalid id', async () => {
      const id = 'randomid';
      try {
        targetId.transform(id, metadataParams);
      } catch (err) {
        expect(err.getResponse().message).toEqual('Invalid mongoId');
      }
    });
  });

  describe('Update', () => {
    it('should update a product', async () => {
      const id = '62df82997d5db3aa7cf4cc53';
      const product = new Product();
      const productUpdate = {
        ...product,
        name: 'test',
        price: 1,
        description: 'test',
      };
      productService.update.mockReturnValue(productUpdate);
      expect(await productController.update(id, product)).toEqual(
        productUpdate,
      );
    });

    it('should throw an error message if invalid id', async () => {
      const id = 'randomid';
      try {
        targetId.transform(id, metadataParams);
      } catch (err) {
        expect(err.getResponse().message).toEqual('Invalid mongoId');
      }
    });

    it('should throw an error message if the product is not found', async () => {
      const id = '62df82997d5db3aa7cf4cc53';
      productService.update.mockReturnValue(new ProductNotFoundException());
      expect(await productController.update(id, new Product())).toEqual(
        new ProductNotFoundException(),
      );
    });
  });

  describe('Remove', () => {
    it('should remove a product', async () => {
      const id = '62df82997d5db3aa7cf4cc53';
      const product = new Product();
      productService.remove.mockReturnValue(product);
      expect(await productController.remove(id)).toEqual(product);
    });

    it('should throw an error message if invalid id', async () => {
      const id = 'randomid';
      try {
        targetId.transform(id, metadataParams);
      } catch (err) {
        expect(err.getResponse().message).toEqual('Invalid mongoId');
      }
    });

    it('should throw an error message if the product is not found', async () => {
      const id = '62df82997d5db3aa7cf4cc53';
      productService.remove.mockReturnValue(new ProductNotFoundException());
      expect(await productController.remove(id)).toEqual(
        new ProductNotFoundException(),
      );
    });
  });

  describe('AddReview', () => {
    it('should throw an error message if invalid id', async () => {
      const id = 'randomid';
      try {
        targetId.transform(id, metadataParams);
      } catch (err) {
        expect(err.getResponse().message).toEqual('Invalid mongoId');
      }
    });

    it('should add a review', async () => {
      const id = '62df82997d5db3aa7cf4cc53';
      const review = {
        userId: 'test',
        rating: 1,
        comment: 'test',
        email: 'meat@gmail.com',
        createdAt: new Date(),
      };
      let product = new Product();
      product = { ...product, reviews: [review] };
      productService.addReview.mockReturnValue(product);
      expect(await productController.addReview(id, review)).toEqual(product);
    });

    it('should throw an error message if the product is not found', async () => {
      const id = '62df82997d5db3aa7cf4cc53';
      const review = {
        userId: 'test',
        rating: 1,
        comment: 'test',
        email: 'test@gmail.com',
      };
      productService.addReview.mockReturnValue(new ProductNotFoundException());
      expect(await productController.addReview(id, review)).toEqual(
        new ProductNotFoundException(),
      );
    });
  });
});
