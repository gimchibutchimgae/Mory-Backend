import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { LoginGuard } from 'src/auth/security/auth.guard';
import { Request } from 'express';
import { Payload } from 'src/auth/security/payload.interface';

@Controller('analysis')
export class AnalysisController {
  constructor(private analysisService: AnalysisService) {}
  private logger = new Logger('Analysis');

  @Get(':id')
  @UseGuards(LoginGuard)
  async find(@Req() req: Request, @Param('id') id: number) {
    const payload = req.user as Payload;
    const analysis = await this.analysisService.findOne({ id });
    if (payload.id != analysis?.diary.user.id)
      throw new ForbiddenException('해당 일기에 대한 접근 권한이 없습니다.');
  }

  @Post('gpt')
  @UseGuards(LoginGuard)
  async analysis(@Req() req: Request, @Body() body: { diaryId: number }) {
    if (!body.diaryId) throw new BadRequestException();
    const payload = req.user as Payload;
    this.logger.log(`${payload.email} 일기 분석`);
    return await this.analysisService.analysisDiary(payload.id, body.diaryId);
  }
}
