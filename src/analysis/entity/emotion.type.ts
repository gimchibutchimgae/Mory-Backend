/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
export type EMOTION_TYPE = 'RED' | 'YELLOW' | 'BLUE' | 'GREEN';

export type EMOTION_RATIO = [EMOTION_TYPE, number][];

export const EMOTIONS = {
  RED : [ "격분한", "공황에 빠진", "스트레스 받는", "초조한", "충격받은",
  "경노한", "몸시 화가 난", "좌절한", "신경이 날카로운", "망연자실한",
  "화가 치밀어 오른", "겁먹은", "화난", "초조한", "안절부절못하는",
  "불안한", "우려하는", "근심하는", "짜증나는", "거슬리는",
  "불쾌한", "골치 아픈", "염려하는", "마음이 불편한", "언짢은",],

  YELLOW : ["역겨운", "침울한", "실망스러운", "의욕 없는", "냉담한",
  "비관적인", "시무룩한", "낙담한", "슬픈", "지루한",
  "소외된", "비참한", "쓸쓸한", "기죽은", "피곤한",
  "의기소침한", "우울한", "뚱한", "기진맥진한", "지친",
  "절망한", "가망 없는", "고독한", "소모된", "진이 빠진",],

  BLUE : ["놀란", "긍정적인", "흥겨운", "아주 신나는", "황홀한",
  "들뜬", "쾌활한", "동기 부여된", "영감을 받은", "의기양양한",
  "기운이 넘치는", "활발한", "흥분된", "낙관적인", "열광하는",
  "만족스러운", "집중하는", "행복한", "자랑스러운", "짜릿한",
  "유쾌한", "기쁜", "희망찬", "재미있는", "더없이 행복한",],

  GREEN : ["속 편한", "태평한", "자족하는", "다정한", "충만한",
  "평온한", "안전한", "만족스러운", "감사하는", "감동적인",
  "여유로운", "차분한", "편안한", "축복받은", "안정적인",
  "한가로운", "생각에 잠긴", "평화로운", "편한", "근심 걱정 없는",
  "나른한", "흐뭇한", "고요한", "안락한", "안온한"],
} as const;

export type RedEmotion = (typeof EMOTIONS.RED)[number];
export type YellowEmotion = (typeof EMOTIONS.RED)[number];
export type BlueEmotion = (typeof EMOTIONS.RED)[number];
export type GreenEmotion = (typeof EMOTIONS.RED)[number];

export interface INCLUDED_EMOTIONS {
  RED : RedEmotion[],
  YELLOW : YellowEmotion[],
  BLUE : BlueEmotion[],
  GREEN : GreenEmotion[],
}