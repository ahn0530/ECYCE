import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateHistoryDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  recyclableId: string;

  @IsNumber()
  @IsNotEmpty()
  points: number;

  @IsString()
  @IsOptional()
  description?: string;
}