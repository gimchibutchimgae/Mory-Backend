import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyAnalysisService } from './monthly_analysis.service';
import { MonthlyAnalysis } from './entity/monthly_analysis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyAnalysis])],
  exports: [MonthlyAnalysisService],
  providers: [MonthlyAnalysisService],
})
export class MonthlyAnalysisModule {}
