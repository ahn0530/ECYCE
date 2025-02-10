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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findById(id: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    await this.usersRepository.update({ id }, updateUserDto);
    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new NotFoundException('업데이트할 사용자를 찾을 수 없습니다.');
    }
    return updatedUser;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.usersRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('삭제할 사용자를 찾을 수 없습니다.');
    }
    return true;
  }

  async changePassword(id: string, newPassword: string): Promise<boolean> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const result = await this.usersRepository.update({ id }, { password: hashedPassword });
    return result.affected > 0;
  }

  // async getUserProfile(id: string): Promise<{ id: string; points: number }> {
  //   const user = await this.findById(id);
  //   if (!user) {
  //     throw new NotFoundException('사용자를 찾을 수 없습니다.');
  //   }
  //   return { id: user.id, points: user.points };
  // }
}
