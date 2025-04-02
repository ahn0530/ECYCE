import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
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

async getAllRecyclables(): Promise<Recyclable[]> {
  return this.recyclablesRepository.find();
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

async getPaginatedSearch(
  page: number,
  limit: number,
  q?: string,
  type?: string,
): Promise<{
  data: Recyclable[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}> {
  const skip = (page - 1) * limit;

  // 검색 조건 빌드
  let where: any = {};
  if (q) {
    const lowerQ = q.toLowerCase();
    if (type === 'product') {
      where = [
        { barcode: ILike(`%${q}%`) },
        { name: ILike(`%${q}%`) },
      ];
    } else if (type === 'company') {
      where = { manufacturer: ILike(`%${q}%`) };
    } else {
      // 전체
      where = [
        { barcode: ILike(`%${q}%`) },
        { name: ILike(`%${q}%`) },
        { manufacturer: ILike(`%${q}%`) },
        { points: ILike(`%${q}%`) },
        { additionalInfo: ILike(`%${q}%`) },
      ];
    }
  }
  
  const [data, totalCount] = await this.recyclablesRepository.findAndCount({
    where,
    skip,
    take: limit,
  });
  
  const totalPages = Math.ceil(totalCount / limit);

    return {
      data,
      totalCount,
      currentPage: page,
      totalPages,
    };
  }

async getTopEPRCompanies(limit: number = 3) {
      // 예시 데이터 - 실제 구현 시 DB 쿼리로 대체
      // EPR 이행률이 높은 상위 기업들 조회
      const companies = await this.recyclablesRepository
        .createQueryBuilder('recyclable')
        .select([
          'recyclable.manufacturer as name',
          'COUNT(history.id) as scans'
        ])
        .leftJoin(History, 'history', 'history.barcode = recyclable.barcode')
        .groupBy('recyclable.manufacturer')
        .orderBy('scans', 'DESC')
        .limit(limit)
        .getRawMany();
    
      // 실제 EPR 이행률은 복잡한 계산이 필요하므로 예시로 임의 값 부여
      return companies.map((company, index) => ({
        name: company.name,
        completion: 95 - (index * 5), // 예시 데이터
        scans: parseInt(company.scans)
      }));
    }
    
async getTopScannedProducts(limit: number = 3) {
      // 스캔 횟수가 많은 상위 제품들 조회
      return await this.recyclablesRepository
        .createQueryBuilder('recyclable')
        .select([
          'recyclable.name as name',
          'COUNT(history.id) as scans'
        ])
        .leftJoin(History, 'history', 'history.barcode = recyclable.barcode')
        .groupBy('recyclable.name')
        .orderBy('scans', 'DESC')
        .limit(limit)
        .getRawMany();
    }
    
async getCategoryDistribution() {
      // 카테고리별 재활용 비율 조회
      return await this.historyRepository
        .createQueryBuilder('history')
        .select([
          'history.category as name',
          'COUNT(history.id) as value'
        ])
        .groupBy('history.category')
        .orderBy('value', 'DESC')
        .getRawMany();
    }
  }