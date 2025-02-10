import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { History } from '../history/history.entity';
import { UserReward } from '../rewards/user_reward.entity';
@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;
  
  @Column()
  password: string;

  @Column({ default: 0 })
  points: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => History, (history) => history.user)
  history: History[];

  @OneToMany(() => UserReward, (userReward) => userReward.user)
  rewards: UserReward[];
}