import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reward } from './reward.entity';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(Reward)
    private rewardsRepository: Repository<Reward>,
  ) {}

  create(createRewardDto: CreateRewardDto) {
    return this.rewardsRepository.save(createRewardDto);
  }

  findAll() {
    return this.rewardsRepository.find({
      relations: ['user']
    });
  }

  findOne(id: string) {
    return this.rewardsRepository.findOne({
      where: { id },
      relations: ['user']
    });
  }

  // 사용자별 리워드 조회
  findByUser(userId: string) {
    return this.rewardsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  // 사용자의 총 포인트 조회
  async getUserTotalPoints(userId: string) {
    const rewards = await this.rewardsRepository.find({
      where: { user: { id: userId } }
    });

    return rewards.reduce((total, reward) => {
      return total + (reward.type === '적립' ? reward.points : -reward.points);
    }, 0);
  }

  update(id: string, updateRewardDto: UpdateRewardDto) {
    return this.rewardsRepository.update(id, updateRewardDto);
  }

  remove(id: string) {
    return this.rewardsRepository.delete(id);
  }
}