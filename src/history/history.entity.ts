import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Recyclable } from '../recyclables/recyclable.entity';

@Entity()
export class History {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.history, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  category: string; // 재활용품의 카테고리 (예: 플라스틱, 캔, 종이 등)

  @Column()
  points: number; // 획득한 포인트

  @Column({ default: 1 })
  count: number; // 같은 품목을 몇 개 재활용했는지 기록

  @CreateDateColumn()
  createdAt: Date; // 재활용한 날짜 (자동 생성)

  @ManyToOne(() => Recyclable)
  recyclable: Recyclable;

}
