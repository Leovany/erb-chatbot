import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  // 获取所有分店 - GET /api/shop
  @Get()
  async getAllShops() {
    return await this.shopService.findAll();
  }

  // 根据ID获取分店 - GET /api/shop/1
  @Get(':id')
  async getShop(@Param('id') id: string) {
    return await this.shopService.findOne(id);
  }

  // 获取附近分店 - GET /api/shop/22.31666921/114.1707795
  @Get(':lat/:lng')
  async getNearbyShops(@Param('lat') lat: string, @Param('lng') lng: string) {
    return await this.shopService.findNearbyShops(
      parseFloat(lat),
      parseFloat(lng),
    );
  }

  // 暂时注释掉创建、更新、删除路由
  /*
  @Post()
  async createShop(@Body() shopData: any) {
    return await this.shopService.create(shopData);
  }

  @Put(':id')
  async updateShop(@Param('id') id: string, @Body() updateData: any) {
    return await this.shopService.update(id, updateData);
  }

  @Delete(':id')
  async deleteShop(@Param('id') id: string) {
    return await this.shopService.remove(id);
  }
  */
}