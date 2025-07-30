import { User } from 'src/auth/entity/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MonthlyAnalysis {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.monthlyAnalysis)
  user: User;
}
