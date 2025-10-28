import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from '../dto/create-shop.dto';
import { UpdateShopDto } from '../dto/update-shop.dto';
import { SkipAuth } from '../auth/decorators/skipauth.decorator';

@Controller('shop')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  // 获取所有分店
  @SkipAuth()
  @Get()
  async getAllShops() {
    const shops = await this.shopService.findAll();
    return {
      success: true,
      data: shops,
      count: shops.length,
      message: '获取分店列表成功'
    };
  }

  // 根据ID获取分店（支持MongoDB ID和数字ID）
  @SkipAuth()
  @Get(':id')
  async getShop(@Param('id') id: string) {
    let shop;
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      shop = await this.shopService.findOne(id);
    } else {
      shop = await this.shopService.findById(parseInt(id));
    }
    
    return {
      success: true,
      data: shop,
      message: '获取分店信息成功'
    };
  }

  // 获取附近分店
  @SkipAuth()
  @Get('nearby/:lat/:lng')
  async getNearbyShops(@Param('lat') lat: string, @Param('lng') lng: string) {
    const shops = await this.shopService.findNearbyShops(
      parseFloat(lat),
      parseFloat(lng),
    );
    
    return {
      success: true,
      data: shops,
      count: shops.length,
      message: '获取附近分店成功'
    };
  }

  // 创建新分店
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createShop(@Body() createShopDto: CreateShopDto) {
    const shop = await this.shopService.create(createShopDto);
    
    return {
      success: true,
      data: shop,
      message: '分店创建成功'
    };
  }

  // 更新分店信息（使用数字ID）
  @Put(':id')
  async updateShop(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShopDto: UpdateShopDto
  ) {
    const shop = await this.shopService.update(id, updateShopDto);
    
    return {
      success: true,
      data: shop,
      message: '分店更新成功'
    };
  }

  // 删除分店（支持MongoDB ID和数字ID）
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteShop(@Param('id') id: string) {
    let result;
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      result = await this.shopService.removeById(id);
    } else {
      result = await this.shopService.remove(parseInt(id));
    }
    
    return {
      success: true,
      message: result.message
    };
  }
}