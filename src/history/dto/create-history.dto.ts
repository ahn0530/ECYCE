import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateHistoryDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  recyclableId: number;

  @IsNumber()
  @IsNotEmpty()
  points: number;

  @IsString()
  @IsOptional()
  description?: string;
}