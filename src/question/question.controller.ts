import { Controller, Get, Param } from '@nestjs/common';
import { QuestionService } from './question.service';
import { SkipAuth } from '../auth/decorators/skipauth.decorator';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @SkipAuth()
  @Get()
  async getAllQuestions() {
    return await this.questionService.findAll();
  }

  @SkipAuth()
  @Get(':id')
  async getQuestion(@Param('id') id: string) {
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      return await this.questionService.findOne(id);
    } else {
      return await this.questionService.findById(parseInt(id));
    }
  }

  @SkipAuth()
  @Get('search/:keyword')
  async searchQuestions(@Param('keyword') keyword: string) {
    return await this.questionService.searchByKeyword(keyword);
  }
}