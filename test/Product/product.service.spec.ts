import { Product } from '../../src/modules/product/product.entity';
import { ProductService } from '../../src/modules/product/product.service';
import { MockType, repositoryMockFactory } from '../mocker';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductService', () => {
  let productService: ProductService;
  let repositoryMock: MockType<Repository<Product>>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    productService = moduleRef.get<ProductService>(ProductService);
    repositoryMock = moduleRef.get(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find a product by id', async () => {
    const product = {
      name: 'product',
      _id: '62d133dff7b8b0612355b4a6',
      price: 10,
      description: 'description',
    };
    repositoryMock.findOneBy.mockReturnValue(product);
    expect(productService.findOne(product._id)).toEqual(product);
  });

  it('should find all products', async () => {
    const products = [
      {
        name: 'product',
        _id: '62d133dff7b8b0612355b4a6',
        price: 10,
        description: 'description',
      },
      {
        name: 'product',
        _id: '62d133dff7b8b0612355b4a6',
        price: 10,
        description: 'description',
      },
    ];
    repositoryMock.find.mockReturnValue(products);
    expect(productService.findAll()).toEqual(products);
  });

  it('should create a product', async () => {
    const prod = new Product();
    const product = {
      ...prod,
      name: 'product',
      _id: '62d133dff7b8b0612355b4a6',
      price: 10,
      description: 'description',
      userId: '62d133dff7b8b0612355b4a6',
    };
    repositoryMock.save.mockReturnValue(product);
    expect(productService.create(product)).toEqual(product);
  });

  it.todo('should update a product');
  it.todo('should remove a product');
  it.todo('should add a review to a product');
});
