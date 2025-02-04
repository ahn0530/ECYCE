import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { History } from './history.entity';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private historyRepository: Repository<History>,
  ) {}

  create(createHistoryDto: CreateHistoryDto) {
    return this.historyRepository.save(createHistoryDto);
  }

  findAll() {
    return this.historyRepository.find({
      relations: ['user', 'recyclable']
    });
  }

  findOne(id: string) {
    return this.historyRepository.findOne({
      where: { id },
      relations: ['user', 'recyclable']
    });
  }

  // 사용자별 히스토리 조회
  findByUser(userId: string) {
    return this.historyRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'recyclable'],
      order: { createdAt: 'DESC' }
    });
  }

  // 기간별 히스토리 조회
  findByDateRange(startDate: Date, endDate: Date) {
    return this.historyRepository.find({
      where: {
        createdAt: Between(startDate, endDate)
      },
      relations: ['user', 'recyclable'],
      order: { createdAt: 'DESC' }
    });
  }

  update(id: string, updateHistoryDto: UpdateHistoryDto) {
    return this.historyRepository.update(id, updateHistoryDto);
  }

  remove(id: string) {
    return this.historyRepository.delete(id);
  }
}