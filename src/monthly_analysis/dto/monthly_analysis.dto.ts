import { EMOTION_NUMBERS } from 'src/analysis/entity/emotion.type';

export interface MonthluAnalysisDTO {
  month: number;
  ratios: EMOTION_NUMBERS;
  emotions_count: EMOTION_NUMBERS;
  emotions_count_delta: EMOTION_NUMBERS;
}
