import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ShopService {
  private readonly dataPath = path.join(__dirname, '../../db/shop.json');

  private readData(): any[] {
    try {
      const data = fs.readFileSync(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('读取分店数据失败:', error);
      return [];
    }
  }

  async findAll(): Promise<any[]> {
    return this.readData();
  }

  async findOne(id: string): Promise<any> {
    const shops = this.readData();
    const shop = shops.find(s => s.id === parseInt(id));
    if (!shop) {
      throw new NotFoundException(`分店 ID ${id} 未找到`);
    }
    return shop;
  }

  async findNearbyShops(lat: number, lng: number): Promise<any[]> {
    const shops = this.readData();
    const latRange = 0.018;
    const lngRange = 0.018;
    
    return shops.filter(shop => 
      shop.lat >= lat - latRange && 
      shop.lat <= lat + latRange &&
      shop.lng >= lng - lngRange && 
      shop.lng <= lng + lngRange
    );
  }

  // 暂时注释掉创建、更新、删除方法
  /*
  async create(shopData: any): Promise<any> {
    const shops = this.readData();
    const newShop = { id: Date.now(), ...shopData };
    shops.push(newShop);
    this.writeData(shops);
    return newShop;
  }

  async update(id: string, updateData: any): Promise<any> {
    const shops = this.readData();
    const index = shops.findIndex(s => s.id === parseInt(id));
    if (index === -1) {
      throw new NotFoundException(`分店 ID ${id} 未找到`);
    }
    shops[index] = { ...shops[index], ...updateData };
    this.writeData(shops);
    return shops[index];
  }

  async remove(id: string): Promise<{ message: string }> {
    const shops = this.readData();
    const index = shops.findIndex(s => s.id === parseInt(id));
    if (index === -1) {
      throw new NotFoundException(`分店 ID ${id} 未找到`);
    }
    shops.splice(index, 1);
    this.writeData(shops);
    return { message: '分店删除成功' };
  }

  private writeData(data: any[]): void {
    fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
  }
  */
}