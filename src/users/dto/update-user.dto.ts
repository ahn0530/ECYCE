import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  password?: string; // 비밀번호 업데이트 시 bcrypt 적용

  @IsOptional()
  points?: number;

  @IsOptional()
  isActive?: boolean;
}
