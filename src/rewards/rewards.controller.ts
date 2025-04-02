import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, NotFoundException } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { LocalAuthGuard } from '@src/auth/local.authGuard';

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

  @Put(':id')
  async updateReward(@Param('id') id: string, @Body() updateRewardDto: UpdateRewardDto) {
    const updated = await this.rewardService.updateReward(+id, updateRewardDto);
    if (!updated) {
      throw new NotFoundException('업데이트할 리워드를 찾을 수 없습니다.');
    }
    return updated;
  }

  @UseGuards(LocalAuthGuard)
  @Post(':userId/redeem/:rewardId')
  async redeemReward(@Param('userId') userId: string, @Param('rewardId') rewardId: number) {
    return this.rewardService.redeemReward(userId, rewardId);
  }

  @UseGuards(LocalAuthGuard)
  @Get(':userId/history')
  async getUserRewardHistory(@Param('userId') userId: string) {
    return this.rewardService.getUserRewardHistory(userId);
  }

}
