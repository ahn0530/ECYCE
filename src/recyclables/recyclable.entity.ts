import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('recyclable')
export class Recyclable {
  @PrimaryColumn({ unique: true })
  barcode:string

  @Column()
  name: string;

  @Column()
  category: string;  // 재활용품 종류 (플라스틱, 유리 등)

  @Column()
  manufacturer: string;  // 제조사

  @Column( {nullable: true} )
  additionalInfo : string;
  
  @Column( { default:0 } )
  points: number;  // 포인트 가치

   @Column({ nullable: true, default: '/images/default-recyclable.png' })
  imageUrl: string;  // 제품 이미지 URL

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}