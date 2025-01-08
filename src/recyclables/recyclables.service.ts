import { Injectable } from '@nestjs/common';
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

  create(createRecyclableDto: CreateRecyclableDto) {
    return this.recyclablesRepository.save(createRecyclableDto);
  }

  findAll() {
    return this.recyclablesRepository.find({
      relations: ['user']
    });
  }

  findOne(id: number) {
    return this.recyclablesRepository.findOne({ 
      where: { id },
      relations: ['user']
    });
  }

  update(id: number, updateRecyclableDto: UpdateRecyclableDto) {
    return this.recyclablesRepository.update(id, updateRecyclableDto);
  }

  remove(id: number) {
    return this.recyclablesRepository.delete(id);
  }

  // 사용자별 재활용품 조회
  findByUser(userId: number) {
    return this.recyclablesRepository.find({
      where: { user: { id: userId } },
      relations: ['user']
    });
  }
}