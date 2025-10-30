import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop } from './shop.schema';
import{CreateShopDto} from'../dto/create-shop.dto';
import{UpdateShopDto} from'../dto/update-shop.dto';

@Injectable()
export class ShopService {
  removeById(id: string): any {
    throw new Error('Method not implemented.');
  }
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
    // 使用近似距离计算（适用于小范围）
    const allShops = await this.shopModel.find().exec();
    
    return allShops.filter(shop => {
      const distance = this.calculateDistance(lat, lng, shop.lat, shop.lng);
      return distance <= 2; // 2公里内
    });
  }

  // 计算两个坐标点之间的距离（公里）
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // 地球半径（公里）
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // 距离（公里）
    
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
async create(createShopDto: CreateShopDto): Promise<Shop> {
    // 检查ID是否已存在
    const existingShop = await this.shopModel.findOne({ id: createShopDto.id }).exec();
    if (existingShop) {
      throw new ConflictException(`分店ID ${createShopDto.id} 已存在`);
    }

    // 检查分店名称是否已存在
    const existingShopName = await this.shopModel.findOne({ 
      shopName: createShopDto.shopName 
    }).exec();
    if (existingShopName) {
      throw new ConflictException(`分店名称 "${createShopDto.shopName}" 已存在`);
    }

    try {
      const createdShop = new this.shopModel({
        ...createShopDto,
        // location: {
        //   type: "Point",
        //   coordinates: [createShopDto.lng, createShopDto.lat]
        // }
      });
      return await createdShop.save();
    } catch (error) {
      throw new BadRequestException(`创建分店失败: ${error.message}`);
    }
  }

async update(id: number, updateShopDto: UpdateShopDto): Promise<Shop> {
    // 检查分店是否存在
    const existingShop = await this.shopModel.findOne({ id }).exec();
    if (!existingShop) {
      throw new NotFoundException(`分店 ID ${id} 未找到`);
    }

    // 如果要更新ID，检查新ID是否已被使用
    if (updateShopDto.id && updateShopDto.id !== id) {
      const idExists = await this.shopModel.findOne({ id: updateShopDto.id }).exec();
      if (idExists) {
        throw new ConflictException(`分店ID ${updateShopDto.id} 已被使用`);
      }
    }

    // 如果要更新分店名称，检查新名称是否已被使用
    if (updateShopDto.shopName && updateShopDto.shopName !== existingShop.shopName) {
      const nameExists = await this.shopModel.findOne({ 
        shopName: updateShopDto.shopName,
        id: { $ne: id } // 排除当前分店
      }).exec();
      if (nameExists) {
        throw new ConflictException(`分店名称 "${updateShopDto.shopName}" 已被使用`);
      }
    }

    try {
      // 如果有经纬度更新，同时更新location字段
      // const updateData: any = { ...updateShopDto };
      // if (updateShopDto.lat !== undefined || updateShopDto.lng !== undefined) {
      //   const newLat = updateShopDto.lat !== undefined ? updateShopDto.lat : existingShop.lat;
      //   const newLng = updateShopDto.lng !== undefined ? updateShopDto.lng : existingShop.lng;
      //   updateData.location = {
      //     type: "Point",
      //     coordinates: [newLng, newLat]
      //   };
      // }

      const updatedShop = await this.shopModel.findOneAndUpdate(
        { id },
        // { $set: updateData },
        { new: true, runValidators: true }
      ).exec();

      if (!updatedShop) {
        throw new NotFoundException(`分店 ID ${id} 未找到`);
      }

      return updatedShop;
    } catch (error) {
      throw new BadRequestException(`更新分店失败: ${error.message}`);
    }
  }

  // 删除分店
  async remove(id: number): Promise<{ message: string }> {
    const result = await this.shopModel.findOneAndDelete({ id }).exec();
    
    if (!result) {
      throw new NotFoundException(`分店 ID ${id} 未找到`);
    }

    return { message: `分店 ID ${id} 已成功删除` };
  }

}