import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analysis } from './entity/analysis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Analysis])],
  exports: [AnalysisService],
  providers: [AnalysisService],
  controllers: [AnalysisController],
})
export class AnalysisModule {}
