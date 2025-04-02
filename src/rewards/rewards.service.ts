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
  private readonly DEFAULT_IMAGE = '/images/default-reward.png';

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
    // 기본 이미지 URL 설정
    const rewardData = {
      ...createRewardDto,
      imageUrl: createRewardDto.imageUrl || this.DEFAULT_IMAGE
    };
    
    const reward = this.rewardRepository.create(rewardData);
    return await this.rewardRepository.save(reward);
  }

  async updateReward(id: number, updateRewardDto: UpdateRewardDto): Promise<Reward> {
    const reward = await this.rewardRepository.findOne({ where: { id } });
    
    if (!reward) {
      throw new NotFoundException('업데이트할 리워드를 찾을 수 없습니다.');
    }
    
    // 이미지 URL이 빈 문자열이면 기본 이미지로 설정
    if (updateRewardDto.imageUrl === '') {
      updateRewardDto.imageUrl = this.DEFAULT_IMAGE;
    }
    
    const updated = this.rewardRepository.merge(reward, updateRewardDto);
    return await this.rewardRepository.save(updated);
  }
  
  async redeemReward(userId: string, rewardId: number): Promise<{ userReward: UserReward, remainingPoints: number }> {
    let retries = 3;

    while (retries > 0) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

      const reward = await this.rewardRepository.findOne({ where: { id: rewardId } });
      if (!reward) throw new NotFoundException('리워드를 찾을 수 없습니다.');

      if (user.points < reward.cost) {
        throw new BadRequestException('포인트가 부족합니다.');
      }

      try {
        // 포인트 차감 (낙관적 락 적용)
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
      } catch (error) {
        if (--retries === 0) {
          throw new Error('포인트 사용 충돌 발생, 재시도 실패');
        }
      }
    }
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
  
  async getUserSpentPointsHistory(userId: string) {
    const history = await this.userRewardRepository.find({
      where: { user: { id: userId } },
      relations: ['reward'],
    });
  }
}
