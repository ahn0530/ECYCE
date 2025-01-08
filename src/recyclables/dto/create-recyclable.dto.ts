import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateRecyclableDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  manufacturer: string;

  @IsNumber()
  points: number;

  @IsNumber()
  userId: number;
}