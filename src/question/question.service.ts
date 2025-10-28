import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from './question.schema';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(@InjectModel(Question.name) private questionModel: Model<Question>) {}

  async findAll(): Promise<Question[]> {
    return this.questionModel.find().sort({ id: 1 }).exec();
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.questionModel.findById(id).exec();
    if (!question) {
      throw new NotFoundException(`问答 ID ${id} 未找到`);
    }
    return question;
  }

  async findById(id: number): Promise<Question> {
    const question = await this.questionModel.findOne({ id }).exec();
    if (!question) {
      throw new NotFoundException(`问答 ID ${id} 未找到`);
    }
    return question;
  }

  async searchByKeyword(keyword: string): Promise<Question[]> {
    const regex = new RegExp(keyword, 'i');
    return this.questionModel.find({
      $or: [
        { question: { $regex: regex } },
        { answer: { $regex: regex } },
        { category: { $regex: regex } }
      ]
    }).sort({ id: 1 }).exec();
  }

  // 创建新问答
  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    // 检查 ID 是否已存在
    const existingQuestion = await this.questionModel.findOne({ id: createQuestionDto.id }).exec();
    if (existingQuestion) {
      throw new ConflictException(`问答 ID ${createQuestionDto.id} 已存在`);
    }

    try {
      const newQuestion = new this.questionModel(createQuestionDto);
      return await newQuestion.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('问答已存在');
      }
      throw new BadRequestException('创建问答失败');
    }
  }

  // 更新问答
  async update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    let question: Question | null;

    // 检查是 ObjectId 还是数字 ID
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      question = await this.questionModel.findById(id).exec();
    } else {
      question = await this.questionModel.findOne({ id: parseInt(id) }).exec();
    }

    if (!question) {
      throw new NotFoundException(`问答 ID ${id} 未找到`);
    }

    // 如果更新了 ID，检查新 ID 是否已存在
    if (updateQuestionDto.id && updateQuestionDto.id !== question.id) {
      const existingQuestion = await this.questionModel.findOne({ id: updateQuestionDto.id }).exec();
      if (existingQuestion) {
        throw new ConflictException(`问答 ID ${updateQuestionDto.id} 已存在`);
      }
    }

    try {
      if (/^[0-9a-fA-F]{24}$/.test(id)) {
        const updated = await this.questionModel.findByIdAndUpdate(id, updateQuestionDto, { new: true }).exec();
        if (!updated) {
          throw new NotFoundException(`问答 ID ${id} 未找到`);
        }
        return updated as unknown as Question;
      } else {
        const updated = await this.questionModel.findOneAndUpdate(
          { id: parseInt(id) }, 
          updateQuestionDto, 
          { new: true }
        ).exec();
        if (!updated) {
          throw new NotFoundException(`问答 ID ${id} 未找到`);
        }
        return updated as unknown as Question;
      }
    } catch (error) {
      throw new BadRequestException('更新问答失败');
    }
  }

  // 删除问答 - 确保返回格式与 product.service.ts 一致
  async remove(id: string): Promise<{ message: string }> {
    let result;

    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      result = await this.questionModel.findByIdAndDelete(id).exec();
    } else {
      result = await this.questionModel.findOneAndDelete({ id: parseInt(id) }).exec();
    }

    if (!result) {
      throw new NotFoundException(`问答 ID ${id} 未找到`);
    }

    return { message: '问答删除成功' };
  }

  // 获取下一个可用的 ID
  async getNextId(): Promise<number> {
    const lastQuestion = await this.questionModel
      .findOne()
      .sort({ id: -1 })
      .exec();
    
    return lastQuestion ? lastQuestion.id + 1 : 1;
  }
}