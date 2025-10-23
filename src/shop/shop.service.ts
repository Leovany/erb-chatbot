import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop } from './shop.schema';

@Injectable()
export class ShopService {
  constructor(@InjectModel(Shop.name) private shopModel: Model<Shop>) {}

  async findAll(): Promise<Shop[]> {
    return this.shopModel.find().exec();
  }

  async findOne(id: string): Promise<Shop> {
    const shop = await this.shopModel.findById(id).exec();
    if (!shop) {
      throw new NotFoundException(`分店 ID ${id} 未找到`);
    }
    return shop;
  }

  async findById(id: number): Promise<Shop> {
    const shop = await this.shopModel.findOne({ id }).exec();
    if (!shop) {
      throw new NotFoundException(`分店 ID ${id} 未找到`);
    }
    return shop;
  }

  async findNearbyShops(lat: number, lng: number): Promise<Shop[]> {
    const latRange = 0.018;
    const lngRange = 0.018;
    
    return this.shopModel.find({
      lat: { 
        $gte: lat - latRange, 
        $lte: lat + latRange 
      },
      lng: { 
        $gte: lng - lngRange, 
        $lte: lng + lngRange 
      }
    }).exec();
  }
}