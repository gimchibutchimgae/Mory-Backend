import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Analysis } from './entity/analysis.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnalysisService {
  constructor(@InjectRepository(Analysis) analysisRepo: Repository<Analysis>) {}
}
