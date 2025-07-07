import { Diary } from 'src/diary/entity/diary.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EMOTION_RATIO, EMOTION_TYPE, INCLUDED_EMOTIONS } from './emotion.type';

@Entity()
export class Analysis {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Diary, (diary) => diary.analysis)
  @JoinColumn()
  diary: Diary;

  @Column({ default: 'RED' })
  primary_emotion_type: EMOTION_TYPE;

  @Column('simple-json')
  emotions: INCLUDED_EMOTIONS;

  // MySQL : 'simple-json' | PostgreSQL : 'json'
  @Column('simple-json')
  ratio: EMOTION_RATIO;
}
