import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { LoginGuard } from 'src/auth/security/auth.guard';

@Controller('analysis')
export class AnalysisController {
  constructor(private analysisService: AnalysisService) {}

  @Get(':id')
  @UseGuards(LoginGuard)
  find(@Param('id') id: number) {
    // 사용자 인증 처리
    return this.analysisService.findOne({ id });
  }

  @Post('gpt')
  @UseGuards(LoginGuard)
  async analysis(@Body() diary: { id: number }) {
    return await this.analysisService.analysisDiary(diary.id);
  }
}
