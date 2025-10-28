import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    // 验证是否是有效的 ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new BadRequestException('无效的产品ID格式');
    }

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

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // 检查是否已存在相同ID的产品
    const existingProduct = await this.productModel.findOne({ 
      id: createProductDto.id 
    }).exec();
    
    if (existingProduct) {
      throw new ConflictException(`产品 ID ${createProductDto.id} 已存在`);
    }

    // 检查是否已存在相同产品名称的产品
    const existingByName = await this.productModel.findOne({
      productName: createProductDto.productName
    }).exec();

    if (existingByName) {
      throw new ConflictException(`产品名称 "${createProductDto.productName}" 已存在`);
    }

    try {
      const createdProduct = new this.productModel(createProductDto);
      return await createdProduct.save();
    } catch (error) {
      throw new BadRequestException(`创建产品失败: ${error.message}`);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    let updatedProduct;
    
    // 检查是否是 ObjectId 格式
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      // 使用 MongoDB _id 更新
      
      // 如果尝试更新ID，检查新ID是否已存在
      if (updateProductDto.id !== undefined) {
        const existingProduct = await this.productModel.findOne({ 
          id: updateProductDto.id,
          _id: { $ne: id } // 排除当前文档
        }).exec();
        
        if (existingProduct) {
          throw new ConflictException(`产品 ID ${updateProductDto.id} 已存在`);
        }
      }

      // 如果尝试更新产品名称，检查新名称是否已存在
      if (updateProductDto.productName) {
        const existingByName = await this.productModel.findOne({
          productName: updateProductDto.productName,
          _id: { $ne: id }
        }).exec();

        if (existingByName) {
          throw new ConflictException(`产品名称 "${updateProductDto.productName}" 已存在`);
        }
      }

      updatedProduct = await this.productModel
        .findByIdAndUpdate(id, updateProductDto, { new: true, runValidators: true })
        .exec();
    } else {
      // 尝试解析为数字 ID
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw new BadRequestException('无效的产品ID格式');
      }
      
      // 使用自定义数字 id 更新
      
      // 如果尝试更新ID，检查新ID是否已存在
      if (updateProductDto.id !== undefined) {
        const existingProduct = await this.productModel.findOne({ 
          id: { $eq: updateProductDto.id, $ne: numericId } // 匹配新ID且排除当前文档
        }).exec();
        
        if (existingProduct) {
          throw new ConflictException(`产品 ID ${updateProductDto.id} 已存在`);
        }
      }

      // 如果尝试更新产品名称，检查新名称是否已存在
      if (updateProductDto.productName) {
        const existingByName = await this.productModel.findOne({
          productName: updateProductDto.productName,
          id: { $ne: numericId }
        }).exec();

        if (existingByName) {
          throw new ConflictException(`产品名称 "${updateProductDto.productName}" 已存在`);
        }
      }

      updatedProduct = await this.productModel
        .findOneAndUpdate({ id: numericId }, updateProductDto, { new: true, runValidators: true })
        .exec();
    }

    if (!updatedProduct) {
      throw new NotFoundException(`产品 ID ${id} 未找到`);
    }

    return updatedProduct;
  }

  async remove(id: string): Promise<{ message: string }> {
    let result;
    
    // 检查是否是 ObjectId 格式
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      // 使用 MongoDB _id 删除
      result = await this.productModel.findByIdAndDelete(id).exec();
    } else {
      // 尝试解析为数字 ID
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw new BadRequestException('无效的产品ID格式');
      }
      // 使用自定义数字 id 删除
      result = await this.productModel.findOneAndDelete({ id: numericId }).exec();
    }
    
    if (!result) {
      throw new NotFoundException(`产品 ID ${id} 未找到`);
    }
    return { message: '产品删除成功' };
  }

  async searchByKeyword(keyword: string): Promise<Product[]> {
    if (!keyword || keyword.trim() === '') {
      throw new BadRequestException('搜索关键词不能为空');
    }

    const regex = new RegExp(keyword.trim(), 'i'); // 不区分大小写
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
    if (!keyword || keyword.trim() === '') {
      throw new BadRequestException('搜索关键词不能为空');
    }

    if (minPrice < 0 || maxPrice < 0) {
      throw new BadRequestException('价格不能为负数');
    }

    if (minPrice > maxPrice) {
      throw new BadRequestException('最低价格不能大于最高价格');
    }

    const regex = new RegExp(keyword.trim(), 'i');
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
}