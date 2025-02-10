import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reward } from './reward.entity';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { User } from '../users/user.entity';
import { UserReward } from './user_reward.entity';
@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(Reward)
    private rewardRepository: Repository<Reward>,
    @InjectRepository(UserReward)
    private userRewardRepository: Repository<UserReward>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAvailableRewards(): Promise<Reward[]> {
    return await this.rewardRepository.find();
  }

  async createReward(createRewardDto: CreateRewardDto): Promise<Reward> {
    const reward = this.rewardRepository.create(createRewardDto);
    return await this.rewardRepository.save(reward);
  }

  async redeemReward(userId: string, rewardId: number): Promise<{ userReward: UserReward, remainingPoints: number }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    const reward = await this.rewardRepository.findOne({ where: { id: rewardId } });
    if (!reward) throw new NotFoundException('리워드를 찾을 수 없습니다.');

    if (user.points < reward.cost) {
      throw new BadRequestException('포인트가 부족합니다.');
    }

    // 포인트 차감
    user.points -= reward.cost;
    await this.userRepository.save(user);

    // 사용자 리워드 내역 저장
    const userReward = this.userRewardRepository.create({
      user,
      reward,
      usedPoints: reward.cost,
    });
    await this.userRewardRepository.save(userReward);
    return { userReward, remainingPoints: user.points };
  }

  async getUserRewardHistory(userId: string) {
    const history = await this.userRewardRepository.find({
        where: { user: { id: userId } },
        relations: ['reward'],
    });

    return history.map(record => ({
        date: record.createdAt,
        rewardName: record.reward.name,
        usedPoints: record.usedPoints,
        imageUrl: record.reward.imageUrl,
    }));
  }
}
