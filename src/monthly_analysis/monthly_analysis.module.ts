import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyAnalysisService } from './monthly_analysis.service';
import { MonthlyAnalysis } from './entity/monthly_analysis.entity';
import { MonthlyAnalysisController } from './monthly_analysis.controller';
import { AnalysisModule } from 'src/analysis/analysis.module';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyAnalysis]), AnalysisModule],
  exports: [MonthlyAnalysisService],
  providers: [MonthlyAnalysisService],
  controllers: [MonthlyAnalysisController],
})
export class MonthlyAnalysisModule {}
