import { Entity, Column, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Reward } from './reward.entity';
@Entity()
export class UserReward {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.rewards)
  user: User;

  @ManyToOne(() => Reward)
  reward: Reward;

  @Column()
  usedPoints: number;

  @CreateDateColumn()
  createdAt: Date;
}
