import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from '../history/history.entity';
import { Recyclable } from '../recyclables/recyclable.entity';
import { SearchDto } from './search.dto';

@Injectable()
export class MeasurementService {
  constructor(
      @InjectRepository(History)
      private readonly historyRepository: Repository<History>,
      @InjectRepository(Recyclable)
      private readonly recyclablesRepository: Repository<Recyclable>
  ) {}

  // 특정 제품(바코드)의 재활용 횟수 조회
  async getRecyclingByBarcode(barcode: string) {
      const total = await this.historyRepository
          .createQueryBuilder('history')
          .where('history.barcode = :barcode', { barcode })
          .select('COALESCE(SUM(history.count), 0)', 'total')
          .getRawOne();
      return { barcode, totalRecycling: total?.total || 0 };
  }

  // 특정 제조사의 재활용 횟수 조회
  async getRecyclingByManufacturer(manufacturer: string) {
      const total = await this.historyRepository
          .createQueryBuilder('history')
          .leftJoin('recyclable', 'recyclable', 'history.barcode = recyclable.barcode') 
          .where('LOWER(TRIM(recyclable.manufacturer)) = LOWER(TRIM(:manufacturer))', { manufacturer })
          .select('COALESCE(SUM(history.count), 0)', 'total')
          .getRawOne();
      return { manufacturer, totalRecycling: total?.total || 0 };
  }

  // 특정 제조사의 제품별 측정 횟수 상세 조회
  async getDetailedRecyclingByManufacturer(manufacturer: string) {
      const products = await this.recyclablesRepository
          .createQueryBuilder('recyclable')
          .select([
              'recyclable.name AS name',
              'recyclable.barcode AS barcode',
              'COALESCE(COUNT(history.id), 0) AS scanCount'
          ])
          .leftJoin(History, 'history', 'history.barcode = recyclable.barcode')
          .where('recyclable.manufacturer = :manufacturer', { manufacturer })
          .groupBy('recyclable.name, recyclable.barcode')
          .getRawMany();
      return { manufacturer, products };
  }

  // 모든 카테고리의 재활용 횟수 조회
  async getAllRecyclingByCategory() {
    const totals = await this.historyRepository
        .createQueryBuilder('history')
        .leftJoin('recyclable', 'recyclable', 'history.barcode = recyclable.barcode') 
        .select(['recyclable.category', 'COALESCE(SUM(history.count), 0) AS total'])
        .groupBy('recyclable.category')
        .getRawMany();
    return totals;
  }

  // 특정 재질(카테고리)의 재활용 횟수 조회
async getRecyclingByCategory(category: string) {
    const total = await this.historyRepository
        .createQueryBuilder('history')
        .leftJoin('recyclable', 'recyclable', 'history.barcode = recyclable.barcode') 
        .where('LOWER(TRIM(recyclable.category)) = LOWER(TRIM(:category))', { category }) 
        .select('COALESCE(SUM(history.count), 0)', 'total')
        .getRawOne();
    return { category, totalRecycling: total?.total || 0 };
    }

  async search(query: SearchDto): Promise<{ results: Recyclable[]; totalCount: number; page: number; size: number }> {
    const { q, type, page = 1, size = 10 } = query;
    const skip = (page - 1) * size;

    let queryBuilder = this.recyclablesRepository.createQueryBuilder('recyclable');

    if (q) {
      const lowerQ = q.toLowerCase();
      if (type === 'product') {
        queryBuilder = queryBuilder.where('LOWER(recyclable.name) LIKE :q OR LOWER(recyclable.additionalInfo) LIKE :q', { q: `%${lowerQ}%` });
      } else if (type === 'company') {
        queryBuilder = queryBuilder.where('LOWER(recyclable.manufacturer) LIKE :q', { q: `%${lowerQ}%` });
      } else {
        queryBuilder = queryBuilder.where(
          'LOWER(recyclable.name) LIKE :q OR LOWER(recyclable.additionalInfo) LIKE :q OR LOWER(recyclable.manufacturer) LIKE :q OR recyclable.barcode LIKE :q',
          { q: `%${lowerQ}%` },
        );
      }
    }

    const [results, totalCount] = await queryBuilder.skip(skip).take(size).getManyAndCount();

    return {
      results,
      totalCount,
      page,
      size,
    };
  }
}
