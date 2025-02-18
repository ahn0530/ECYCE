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
    const { userId, barcode, manufacturer, category, points, count } = createHistoryDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const history = this.historyRepository.create({ user, barcode, manufacturer, category, points, count });
    await this.historyRepository.save(history);

    // 사용자 총 포인트 업데이트
    user.points += points * count;
    await this.userRepository.save(user);

    return history;
  }

  async getUserHistory(userId: string): Promise<{ 
    totalPoints: number; 
    totalRecycling: number; 
    categoryStats: Record<string, number>; 
    history: History[] }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const history = await this.historyRepository.find({ where: { user: { id: userId } } });
    const totalPoints = user.points;
    const totalRecycling = history.length;

    const categoryStats = history.reduce((acc, record) => {
    acc[record.category] = (acc[record.category] || 0) + record.count;
    return acc;
  }, {} as Record<string, number>);

  return { totalPoints, totalRecycling, categoryStats, history };

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
    const history = await this.historyRepository
      .createQueryBuilder('history')
      .leftJoinAndSelect('history.user', 'user')
      .where('user.id = :userId', { userId })
      .select([
        'history.createdAt AS date',
        'history.points AS points',
        'history.category AS category'
      ])
      .orderBy('history.createdAt', 'DESC')
      .getRawMany();
  
    return history;
  }
ㅍ  
}
