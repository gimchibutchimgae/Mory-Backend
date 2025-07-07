import { EMOTION_RATIO, INCLUDED_EMOTIONS } from '../entity/emotion.type';

export interface CreateAnalysisDTO {
  diaryId: number;
  emotions: INCLUDED_EMOTIONS;
  ratio: EMOTION_RATIO;
}
