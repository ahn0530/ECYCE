import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardService: RewardsService) {}

  @Get()
  async getAvailableRewards() {
    return this.rewardService.getAvailableRewards();
  }

  @Post()
  async createReward(@Body() createRewardDto: CreateRewardDto) {
    return this.rewardService.createReward(createRewardDto);
  }

  @Post(':userId/redeem/:rewardId')
  async redeemReward(@Param('userId') userId: string, @Param('rewardId') rewardId: number) {
    return this.rewardService.redeemReward(userId, rewardId);
  }

  @Get(':userId/history')
  async getUserRewardHistory(@Param('userId') userId: string) {
    return this.rewardService.getUserRewardHistory(userId);
  }
}
