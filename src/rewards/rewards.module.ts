import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { Reward } from './reward.entity';
import { User } from 'src/users/user.entity';
import { UserReward } from './user_reward.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reward,User,UserReward])],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {}