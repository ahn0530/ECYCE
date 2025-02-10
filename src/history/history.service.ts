import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { History } from './history.entity';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { User } from 'src/users/user.entity';
import { Recyclable } from 'src/recyclables/recyclable.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private historyRepository: Repository<History>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Recyclable)
    private recyclablesRepository: Repository<Recyclable>,
  ) {}

  async createHistory(createHistoryDto: CreateHistoryDto): Promise<History> {
    const { userId, category, points, count } = createHistoryDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const history = this.historyRepository.create({ user, category, points, count });
    await this.historyRepository.save(history);

    // 사용자 총 포인트 업데이트
    user.points += points * count;
    await this.userRepository.save(user);

    return history;
  }

  async getUserHistory(userId: string): Promise<{ totalPoints: number; totalRecycling: number; history: History[] }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const history = await this.historyRepository.find({ where: { user: { id: userId } } });
    const totalPoints = user.points;
    const totalRecycling = history.length;

    return { totalPoints, totalRecycling, history };
  }
  async getUserRecyclingStats(userId: string) {
    const history = await this.historyRepository.find({ where: { user: { id: userId } } });

    const stats = history.reduce((acc, record) => {
        acc[record.category] = (acc[record.category] || 0) + record.count;
        return acc;
    }, {});

    return stats;
  }
  async getUserPointsHistory(userId: string) {
    const history = await this.historyRepository.find({ where: { user: { id: userId } } });

    const pointsHistory = history.map((record) => ({
        date: record.createdAt,
        points: record.points,
        category: record.category,
    }));

    return pointsHistory;
  }
}
