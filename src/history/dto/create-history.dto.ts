import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateHistoryDto {
  @IsNotEmpty()
  @IsNumber()
  userId: string;

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