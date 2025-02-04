import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // ID가 이미 존재하는지 확인
    const existingUser = await this.usersRepository.findOne({ where: { id: userData.id } });
  
    if (existingUser) {
      throw new Error('User already exists'); // 기존 사용자가 있으면 오류 발생
    }
  
    // 새 사용자 삽입
    await this.usersRepository.insert({
      ...userData,
      password: hashedPassword,
    });
  
    // 생성된 사용자 반환
    return this.usersRepository.findOne({ where: { id: userData.id } });
  }
  
  async update(id: string, updateUserDto: Partial<UpdateUserDto>): Promise<User> {
    // 기존 사용자 조회
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    console.log('🔍 Before update:', user);
    console.log('📝 Received update data:', updateUserDto);

    // 비밀번호가 변경되었을 경우 bcrypt 해싱 적용
    if (updateUserDto.password) {
      console.log('🔐 Hashing new password:', updateUserDto.password);
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      user.password = hashedPassword; // 기존 user 객체에 직접 적용
      console.log('✅ Hashed password:', user.password);
    }

    // 변경된 정보 병합 (명확하게 필드 지정)
    user.name = updateUserDto.name ?? user.name;
    user.email = updateUserDto.email ?? user.email;
    user.points = updateUserDto.points ?? user.points;
    user.isActive = updateUserDto.isActive ?? user.isActive;

    // 변경된 정보 저장
    await this.usersRepository.save(user);
    
    // 다시 사용자 정보 조회하여 최신 데이터 반환
    const updatedUser = await this.usersRepository.findOne({ where: { id } });
    console.log('✅ After update:', updatedUser);
    return updatedUser;
  }
  

  async findOne(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  findAll() {
    return this.usersRepository.find();
  }

  remove(id: string) {
    return this.usersRepository.delete(id);
  }
}