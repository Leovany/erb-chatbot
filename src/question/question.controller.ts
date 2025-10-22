import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  async getAllQuestions() {
    return await this.questionService.findAll();
  }

  @Get(':id')
  async getQuestion(@Param('id') id: string) {
    return await this.questionService.findOne(id);
  }

  @Get('search/:keyword')
  async searchQuestions(@Param('keyword') keyword: string) {
    return await this.questionService.searchByKeyword(keyword);
  }

  // 暂时注释掉创建、更新、删除路由
  /*
  @Post()
  async createQuestion(@Body() questionData: any) {
    return await this.questionService.create(questionData);
  }

  @Put(':id')
  async updateQuestion(@Param('id') id: string, @Body() updateData: any) {
    return await this.questionService.update(id, updateData);
  }

  @Delete(':id')
  async deleteQuestion(@Param('id') id: string) {
    return await this.questionService.remove(id);
  }
  */
}