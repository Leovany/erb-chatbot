import { Controller, Get, Param } from '@nestjs/common';
import { ShopService } from './shop.service';
import { SkipAuth } from '../auth/decorators/skipauth.decorator';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @SkipAuth()
  @Get()
  async getAllShops() {
    return await this.shopService.findAll();
  }

  @SkipAuth()
  @Get(':id')
  async getShop(@Param('id') id: string) {
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      return await this.shopService.findOne(id);
    } else {
      return await this.shopService.findById(parseInt(id));
    }
  }

  @SkipAuth()
  @Get('nearby/:lat/:lng')
  async getNearbyShops(@Param('lat') lat: string, @Param('lng') lng: string) {
    return await this.shopService.findNearbyShops(
      parseFloat(lat),
      parseFloat(lng),
    );
  }
}