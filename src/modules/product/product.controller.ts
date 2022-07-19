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
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ValidateMongoId } from 'src/pipes/validation.pipe';
import { createReviewDto } from './dto/create-review.dto';
import { ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({ status: 400, description: 'Missing required fields' })
  @ApiResponse({ status: 201, description: 'Product successfully created' })
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'OK' })
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'FOUND' })
  @ApiResponse({ status: 400, description: 'Invalid mongoId' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id', ValidateMongoId) id: string) {
    const product = await this.productService.findOne(id);
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    return product;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Invalid mongoId' })
  @ApiResponse({ status: 200, description: 'Successfully updated' })
  async update(
    @Param('id', ValidateMongoId) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.update(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Invalid mongoId' })
  @ApiResponse({ status: 204, description: 'Successfully deleted' })
  async remove(@Param('id', ValidateMongoId) id: string) {
    return await this.productService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/review')
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Invalid mongoId' })
  @ApiResponse({ status: 200, description: 'Successfully added review' })
  async addReview(
    @Param('id', ValidateMongoId) id: string,
    @Body() review: createReviewDto,
  ) {
    return await this.productService.addReview(id, review);
  }
}
