import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recyclable } from './recyclable.entity';
import { CreateRecyclableDto } from './dto/create-recyclable.dto';
import { UpdateRecyclableDto } from './dto/update-recyclable.dto';

@Injectable()
export class RecyclablesService {
  private readonly DEFAULT_IMAGE = '/images/default-recyclable.png';

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
    
    // 기본 이미지 URL 설정
    const newRecyclable = {
      ...recyclable,
      imageUrl: recyclable.imageUrl || this.DEFAULT_IMAGE
    };
    
    return this.recyclablesRepository.insert(newRecyclable);
  }
  
  async findAll(): Promise<Recyclable[]> {
    return await this.recyclablesRepository.find();
  }

  async findByBarcode(barcode: string): Promise<Recyclable> {
    return await this.recyclablesRepository.findOne({ where: { barcode } });
  }
  
  async update(barcode: string, updateRecyclableDto: UpdateRecyclableDto): Promise<boolean> {
    // 이미지 URL이 빈 문자열이면 기본 이미지로 설정
    if (updateRecyclableDto.imageUrl === '') {
      updateRecyclableDto.imageUrl = this.DEFAULT_IMAGE;
    }
    
    const result = await this.recyclablesRepository.update({ barcode }, updateRecyclableDto);
    
    if (result.affected === 0) {
      throw new NotFoundException('업데이트할 재활용품을 찾을 수 없습니다.');
    }
  
    return true;
  }
  

  async remove(barcode: string): Promise<boolean> {
    const result = await this.recyclablesRepository.delete(barcode);
    if (result.affected === 0) {
      throw new NotFoundException('삭제할 재활용품을 찾을 수 없습니다.');
    }
    return true;
  }
}