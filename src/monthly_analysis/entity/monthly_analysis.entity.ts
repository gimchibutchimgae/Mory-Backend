import { EMOTION_NUMBERS } from 'src/analysis/entity/emotion.type';
import { User } from 'src/auth/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MonthlyAnalysis {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.monthlyAnalysis)
  user: User;

  @Column()
  month: number;

  @Column('simple-json')
  ratios: EMOTION_NUMBERS;

  @Column('simple-json')
  emotions_count: EMOTION_NUMBERS;

  @Column('simple-json')
  emotions_count_delta: EMOTION_NUMBERS;
}
