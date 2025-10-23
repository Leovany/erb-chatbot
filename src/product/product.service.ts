import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`产品 ID ${id} 未找到`);
    }
    return product;
  }

  async findById(id: number): Promise<Product> {
    const product = await this.productModel.findOne({ id }).exec();
    if (!product) {
      throw new NotFoundException(`产品 ID ${id} 未找到`);
    }
    return product;
  }

  async searchByKeyword(keyword: string): Promise<Product[]> {
    const regex = new RegExp(keyword, 'i'); // 不区分大小写
    return this.productModel.find({
      $or: [
        { productName: { $regex: regex } },
        { description: { $regex: regex } },
        { brandName: { $regex: regex } },
        { category: { $regex: regex } }
      ]
    }).exec();
  }

  async searchByKeywordAndPrice(
    keyword: string, 
    minPrice: number, 
    maxPrice: number
  ): Promise<Product[]> {
    const regex = new RegExp(keyword, 'i');
    return this.productModel.find({
      $and: [
        {
          $or: [
            { productName: { $regex: regex } },
            { description: { $regex: regex } },
            { brandName: { $regex: regex } },
            { category: { $regex: regex } }
          ]
        },
        {
          price: { 
            $gte: minPrice, 
            $lte: maxPrice 
          }
        }
      ]
    }).exec();
  }

  // 如果需要 CRUD 操作，可以取消注释以下方法
  /*
  async create(productData: any): Promise<Product> {
    const newProduct = new this.productModel(productData);
    return newProduct.save();
  }

  async update(id: string, updateData: any): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    ).exec();
    
    if (!product) {
      throw new NotFoundException(`产品 ID ${id} 未找到`);
    }
    return product;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`产品 ID ${id} 未找到`);
    }
    return { message: '产品删除成功' };
  }
  */
}