import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductService {
  private readonly dataPath = path.join(__dirname, '../../db/product.json');

  private readData(): any[] {
    try {
      const data = fs.readFileSync(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('读取产品数据失败:', error);
      return [];
    }
  }

  async findAll(): Promise<any[]> {
    return this.readData();
  }

  async findOne(id: string): Promise<any> {
    const products = this.readData();
    const product = products.find(p => p.id === parseInt(id));
    if (!product) {
      throw new NotFoundException(`产品 ID ${id} 未找到`);
    }
    return product;
  }

  async searchByKeyword(keyword: string): Promise<any[]> {
    const products = this.readData();
    const lowerKeyword = keyword.toLowerCase();
    return products.filter(p => 
      p.productName.toLowerCase().includes(lowerKeyword) || 
      p.description.toLowerCase().includes(lowerKeyword) ||
      p.brandName.toLowerCase().includes(lowerKeyword)
    );
  }

  async searchByKeywordAndPrice(
    keyword: string, 
    minPrice: number, 
    maxPrice: number
  ): Promise<any[]> {
    const products = this.readData();
    const lowerKeyword = keyword.toLowerCase();
    return products.filter(p => 
      (p.productName.toLowerCase().includes(lowerKeyword) || 
       p.description.toLowerCase().includes(lowerKeyword)) &&
      p.price >= minPrice && 
      p.price <= maxPrice
    );
  }

  // 暂时注释掉创建、更新、删除方法
  /*
  async create(productData: any): Promise<any> {
    const products = this.readData();
    const newProduct = { id: Date.now(), ...productData };
    products.push(newProduct);
    this.writeData(products);
    return newProduct;
  }

  async update(id: string, updateData: any): Promise<any> {
    const products = this.readData();
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new NotFoundException(`产品 ID ${id} 未找到`);
    }
    products[index] = { ...products[index], ...updateData };
    this.writeData(products);
    return products[index];
  }

  async remove(id: string): Promise<{ message: string }> {
    const products = this.readData();
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new NotFoundException(`产品 ID ${id} 未找到`);
    }
    products.splice(index, 1);
    this.writeData(products);
    return { message: '产品删除成功' };
  }

  private writeData(data: any[]): void {
    fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
  }
  */
}