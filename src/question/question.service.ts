import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class QuestionService {
  private readonly dataPath = path.join(__dirname, '../../db/qa.json');

  private readData(): any[] {
    try {
      const data = fs.readFileSync(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('读取问答数据失败:', error);
      return [];
    }
  }

  async findAll(): Promise<any[]> {
    return this.readData();
  }

  async findOne(id: string): Promise<any> {
    const questions = this.readData();
    const question = questions.find(q => q.id === parseInt(id));
    if (!question) {
      throw new NotFoundException(`问答 ID ${id} 未找到`);
    }
    return question;
  }

  async searchByKeyword(keyword: string): Promise<any[]> {
    const questions = this.readData();
    const lowerKeyword = keyword.toLowerCase();
    return questions.filter(q => 
      q.question.toLowerCase().includes(lowerKeyword) || 
      q.answer.toLowerCase().includes(lowerKeyword) ||
      q.category.toLowerCase().includes(lowerKeyword)
    );
  }

  // 暂时注释掉创建、更新、删除方法
  /*
  async create(questionData: any): Promise<any> {
    const questions = this.readData();
    const newQuestion = { id: Date.now(), ...questionData };
    questions.push(newQuestion);
    this.writeData(questions);
    return newQuestion;
  }

  async update(id: string, updateData: any): Promise<any> {
    const questions = this.readData();
    const index = questions.findIndex(q => q.id === parseInt(id));
    if (index === -1) {
      throw new NotFoundException(`问答 ID ${id} 未找到`);
    }
    questions[index] = { ...questions[index], ...updateData };
    this.writeData(questions);
    return questions[index];
  }

  async remove(id: string): Promise<{ message: string }> {
    const questions = this.readData();
    const index = questions.findIndex(q => q.id === parseInt(id));
    if (index === -1) {
      throw new NotFoundException(`问答 ID ${id} 未找到`);
    }
    questions.splice(index, 1);
    this.writeData(questions);
    return { message: '问答删除成功' };
  }

  private writeData(data: any[]): void {
    fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
  }
  */
}