import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Recyclable {
  @PrimaryColumn()
  id: string;

  @Column()
  type: string;  // 재활용품 종류 (플라스틱, 유리 등)

  @Column()
  manufacturer: string;  // 제조사

  @Column()
  points: number;  // 포인트 가치

  @ManyToOne(() => User)
  user: User;  // 재활용품을 등록한 사용자

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}