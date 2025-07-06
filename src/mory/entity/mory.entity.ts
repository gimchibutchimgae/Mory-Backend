import { User } from 'src/auth/entity/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Mory {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.mory, {
    cascade: true,
  })
  user: User;

  @Column({ default: 0 })
  growing: number;
}
