import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recyclable } from './recyclable.entity';
import { CreateRecyclableDto } from './dto/create-recyclable.dto';
import { UpdateRecyclableDto } from './dto/update-recyclable.dto';

@Injectable()
export class RecyclablesService {
  constructor(
    @InjectRepository(Recyclable)
    private recyclablesRepository: Repository<Recyclable>,
  ) {}

  async create(recyclable: CreateRecyclableDto) {
    const existing = await this.recyclablesRepository.findOne(
      { where: { barcode: recyclable.barcode } });
    if (existing) {
      throw new ConflictException('이미 등록된 바코드입니다.');
    }
    return this.recyclablesRepository.insert(recyclable);
  }
  
  async findAll(): Promise<Recyclable[]> {
    return await this.recyclablesRepository.find();
  }

  async findByBarcode(barcode: string): Promise<Recyclable> {
    return await this.recyclablesRepository.findOne({ where: { barcode } });
  }
  
  async update(barcode: string, updateRecyclableDto: UpdateRecyclableDto): Promise<boolean> {
    const result = await this.recyclablesRepository.update({ barcode }, updateRecyclableDto);
    
    if (result.affected === 0) {
      throw new NotFoundException('업데이트할 재활용품을 찾을 수 없습니다.');
    }
  
    return true;
  }
  

  async remove(name: string): Promise<boolean> {
    const result = await this.recyclablesRepository.delete(name);
    if (result.affected === 0) {
      throw new NotFoundException('삭제할 재활용품을 찾을 수 없습니다.');
    }
    return true;
  }
}