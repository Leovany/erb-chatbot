import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from './question.schema';

@Injectable()
export class QuestionService {
  constructor(@InjectModel(Question.name) private questionModel: Model<Question>) {}

  async findAll(): Promise<Question[]> {
    return this.questionModel.find().exec();
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
    }).exec();
  }

  // 如果需要 CRUD 操作，可以取消注释以下方法
  /*
  async create(questionData: any): Promise<Question> {
    const newQuestion = new this.questionModel(questionData);
    return newQuestion.save();
  }

  async update(id: string, updateData: any): Promise<Question> {
    const question = await this.questionModel.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    ).exec();
    
    if (!question) {
      throw new NotFoundException(`问答 ID ${id} 未找到`);
    }
    return question;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.questionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`问答 ID ${id} 未找到`);
    }
    return { message: '问答删除成功' };
  }
  */
}