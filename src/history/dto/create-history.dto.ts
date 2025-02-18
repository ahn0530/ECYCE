import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateHistoryDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  barcode: string;

  @IsNotEmpty()
  @IsString()
  manufacturer:string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  @IsNumber()
  points: number;

  @IsOptional()
  @IsNumber()
  count?: number;
}