import { IsInt, Max, Min } from 'class-validator';
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

  @IsInt()
  @Min(0)
  @Max(5)
  @Column({ default: 0 })
  growing: number;
}
