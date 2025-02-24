import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { History } from './history.entity';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private historyRepository: Repository<History>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async createHistory(createHistoryDto: CreateHistoryDto): Promise<History> {
    const { userId, barcode, manufacturer, category, points, count } = createHistoryDto;
    let retries = 3;

    while (retries > 0) {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

      try {
        // 포인트 적립 (낙관적 락 적용)
        user.points += points * count;
        await this.userRepository.save(user); 

        // 히스토리 저장
        const history = this.historyRepository.create({ user, barcode, manufacturer, category, points, count });
        await this.historyRepository.save(history);

        return history;
      } catch (error) {
        if (--retries === 0) {
          throw new Error('포인트 적립 충돌 발생, 재시도 실패');
        }
      }
    }
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
