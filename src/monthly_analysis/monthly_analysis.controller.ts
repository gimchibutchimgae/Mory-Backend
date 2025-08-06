import { Controller, Get, Logger, Param, Req, UseGuards } from '@nestjs/common';
import { MonthlyAnalysisService } from './monthly_analysis.service';
import { LoginGuard } from 'src/auth/security/auth.guard';
import { Request } from 'express';
import { Payload } from 'src/auth/security/payload.interface';

@Controller('monthly-analysis')
export class MonthlyAnalysisController {
  constructor(private monthlyService: MonthlyAnalysisService) {}
  private readonly logger = new Logger('MonthlyAnalysis');

  @Get(':month')
  @UseGuards(LoginGuard)
  async getMonthlyAnalysisByMonth(
    @Req() req: Request,
    @Param('month') month: number,
  ) {
    const payload = req.user as Payload;
    this.logger.log(`${payload.email} ${month}월 분석 생성`);
    const monthlyDto = await this.monthlyService.getMonthlyData(
      payload.id,
      month,
    );
    const existMonthly = await this.monthlyService.findOne({
      user: { id: payload.id },
      month,
    });
    if (existMonthly) {
      this.logger.log(`${payload.email} ${month}월 분석 업데이트`);
      await this.monthlyService.update(existMonthly.id, monthlyDto);
      return {
        id: existMonthly.id,
        ...monthlyDto,
      };
    }
    return this.monthlyService.save(monthlyDto);
  }
}
