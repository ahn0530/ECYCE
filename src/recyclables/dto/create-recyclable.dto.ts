import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateRecyclableDto {
  
  @IsString()
  @IsNotEmpty()
  barcode: string;

  @IsString()
  @IsNotEmpty()
  name: string;  // 제품명 추가

  @IsString()
  @IsNotEmpty()
  manufacturer: string;

  @IsString()
  @IsNotEmpty()
  category: string;  // 기존 type을 category로 변경

  @IsOptional()
  @IsString()
  additionalInfo?: string;  // 추가 정보 필드 반영

  @IsOptional()
  @IsString()
  imageUrl?: string; 

  @IsOptional()
  @IsNumber()
  points: number;

}
