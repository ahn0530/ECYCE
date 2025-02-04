import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Recyclable } from '../recyclables/recyclable.entity';

@Entity()
export class History {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Recyclable)
  recyclable: Recyclable;

  @Column()
  points: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  description: string;
}