import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 获取所有产品 - GET /api/product
  @Get()
  async getAllProducts() {
    return await this.productService.findAll();
  }

  // 根据ID获取产品 - GET /api/product/1
  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }

  // 搜索产品 - GET /api/product/search/iphone
  @Get('search/:keyword')
  async searchProducts(@Param('keyword') keyword: string) {
    return await this.productService.searchByKeyword(keyword);
  }

  // 搜索产品（带价格范围）- GET /api/product/search/iphone/5000/10000
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

  // 暂时注释掉创建、更新、删除路由，因为服务中还没有实现这些方法
  /*
  @Post()
  async createProduct(@Body() productData: any) {
    return await this.productService.create(productData);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() updateData: any) {
    return await this.productService.update(id, updateData);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return await this.productService.remove(id);
  }
  */
}