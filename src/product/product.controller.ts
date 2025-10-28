import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from './product.schema';
import { SkipAuth } from '../auth/decorators/skipauth.decorator';

@ApiTags('products')
@Controller('product')
@UsePipes(new ValidationPipe({ transform: true }))
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @SkipAuth()
  @Get()
  @ApiOperation({ summary: '获取所有产品' })
  @ApiResponse({ status: 200, description: '成功获取产品列表', type: [Product] })
  async getAllProducts(): Promise<Product[]> {
    return await this.productService.findAll();
  }

  @SkipAuth()
  @Get(':id')
  @ApiOperation({ summary: '根据ID获取产品' })
  @ApiParam({ name: 'id', description: '产品ID或MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: '成功获取产品', type: Product })
  @ApiResponse({ status: 404, description: '产品未找到' })
  @ApiResponse({ status: 400, description: '无效的ID格式' })
  async getProduct(@Param('id') id: string): Promise<Product> {
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      return await this.productService.findOne(id);
    } else {
      // 尝试解析为数字ID
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw new Error('无效的产品ID格式');
      }
      return await this.productService.findById(numericId);
    }
  }

  // 移除了 @SkipAuth() - 需要认证
  @Post()
  @ApiOperation({ summary: '创建新产品' })
  @ApiResponse({ status: 201, description: '产品创建成功', type: Product })
  @ApiResponse({ status: 409, description: '产品ID或名称已存在' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productService.create(createProductDto);
  }

  // 移除了 @SkipAuth() - 需要认证
  @Put(':id')
  @ApiOperation({ summary: '更新产品信息' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: '产品更新成功', type: Product })
  @ApiResponse({ status: 404, description: '产品未找到' })
  @ApiResponse({ status: 409, description: '产品ID或名称已存在' })
  @ApiResponse({ status: 400, description: '无效的ID格式或请求参数错误' })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productService.update(id, updateProductDto);
  }

  // 移除了 @SkipAuth() - 需要认证
  @Delete(':id')
  @ApiOperation({ summary: '删除产品' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: '产品删除成功' })
  @ApiResponse({ status: 404, description: '产品未找到' })
  @ApiResponse({ status: 400, description: '无效的ID格式' })
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id') id: string): Promise<{ message: string }> {
    return await this.productService.remove(id);
  }

  @SkipAuth()
  @Get('search/:keyword')
  @ApiOperation({ summary: '根据关键词搜索产品' })
  @ApiParam({ name: 'keyword', description: '搜索关键词' })
  @ApiResponse({ status: 200, description: '搜索成功', type: [Product] })
  @ApiResponse({ status: 400, description: '关键词不能为空' })
  async searchProducts(@Param('keyword') keyword: string): Promise<Product[]> {
    return await this.productService.searchByKeyword(keyword);
  }

  @SkipAuth()
  @Get('search/:keyword/:minPrice/:maxPrice')
  @ApiOperation({ summary: '根据关键词和价格范围搜索产品' })
  @ApiParam({ name: 'keyword', description: '搜索关键词' })
  @ApiParam({ name: 'minPrice', description: '最低价格', type: Number })
  @ApiParam({ name: 'maxPrice', description: '最高价格', type: Number })
  @ApiResponse({ status: 200, description: '搜索成功', type: [Product] })
  @ApiResponse({ status: 400, description: '参数错误' })
  async searchProductsWithPrice(
    @Param('keyword') keyword: string,
    @Param('minPrice', ParseIntPipe) minPrice: number,
    @Param('maxPrice', ParseIntPipe) maxPrice: number,
  ): Promise<Product[]> {
    return await this.productService.searchByKeywordAndPrice(
      keyword,
      minPrice,
      maxPrice,
    );
  }
}