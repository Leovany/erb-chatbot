import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { SkipAuth } from '../auth/decorators/skipauth.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @SkipAuth()
  @Get()
  async getAllProducts() {
    return await this.productService.findAll();
  }

  @SkipAuth()
  @Get(':id')
  async getProduct(@Param('id') id: string) {
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      return await this.productService.findOne(id);
    } else {
      return await this.productService.findById(parseInt(id));
    }
  }

  @SkipAuth()
  @Get('search/:keyword')
  async searchProducts(@Param('keyword') keyword: string) {
    return await this.productService.searchByKeyword(keyword);
  }

  @SkipAuth()
  @Get('search/:keyword/:minPrice/:maxPrice')
  async searchProductsWithPrice(
    @Param('keyword') keyword: string,
    @Param('minPrice') minPrice: string,
    @Param('maxPrice') maxPrice: string,
  ) {
    return await this.productService.searchByKeywordAndPrice(
      keyword,
      parseFloat(minPrice),
      parseFloat(maxPrice),
    );
  }
}