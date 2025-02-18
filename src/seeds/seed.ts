import { DataSource, DataSourceOptions } from 'typeorm';
import { typeOrmConfig } from '../typeorm.config';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { Recyclable } from '../recyclables/recyclable.entity';
import { Reward } from '../rewards/reward.entity';
import { History } from '../history/history.entity';
import { UserReward } from '../rewards/user_reward.entity';

const configService = new ConfigService();
const dbConfig = typeOrmConfig(configService) ;

// TypeORM DataSource 객체 생성
const AppDataSource = new DataSource({
  ...dbConfig, // 기존 설정 불러오기
  entities: [User, Recyclable, Reward, History, UserReward],
} as DataSourceOptions);

async function seed() {
  await AppDataSource.initialize();
  console.log('✅ Database connected!');

  const userRepo = AppDataSource.getRepository(User);
  const recyclableRepo = AppDataSource.getRepository(Recyclable);
  const rewardRepo = AppDataSource.getRepository(Reward);
  const historyRepo = AppDataSource.getRepository(History);
  const userRewardRepo = AppDataSource.getRepository(UserReward);

  // ✅ 1. Users 먼저 삽입
  const users = await userRepo.save([
    { id: 'test', name: 'Alice',  password: '1234', points: 10000},
    { id: 'test1', name: 'Bob',  password: '1234', points: 10000 },
  ]);
  console.log('✅ Users seeded');

  // ✅ 2. Recyclables 삽입
  const recyclables = await recyclableRepo.save([
    { barcode: '8801121768129', name: 'Maeil 소화가 잘되는 우유 오리지널 190mL', category: '멸균팩', manufacturer: '매일유업(주)' },
    { barcode: '8809288633052',name: 'BR 쿠키앤크림 우유 190ml', category: '멸균팩', manufacturer:'배스킨라빈스' },
  ]);
  console.log('✅ Recyclables seeded');

  // ✅ 3. Rewards 삽입
  const rewards = await rewardRepo.save([
    { name: 'Discount Coupon',description:'쿠폰', cost: 100, imageUrl: 'example.png' },
    { name: 'Gift Card',description:'카드', cost: 500, imageUrl: 'example.png' },
  ]);
  console.log('✅ Rewards seeded');

  // ✅ 4. History 삽입 (Users 필요)
  const history = await historyRepo.save([
    { user: users[0], manufacturer: '매일유업(주)', barcode: '8801121768129', category: '멸균팩', points: 20 },
    { user: users[1], manufacturer: '매일유업(주)', barcode: '8801121768129',category: '멸균팩', points: 20 },
  ]);
  console.log('✅ History seeded');

  // ✅ 5. UserRewards 삽입 (Users & Rewards 필요)
  const userRewards = await userRewardRepo.save([
    { user: users[0], reward: rewards[0], usedPoints: 100},
    { user: users[1], reward: rewards[1], usedPoints: 500 },
  ]);
  console.log('✅ User Rewards seeded');

  console.log('🎉 Seed completed successfully!');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Error seeding database:', err);
  AppDataSource.destroy();
});
