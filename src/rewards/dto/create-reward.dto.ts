import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateRewardDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  points: number;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isUsed?: boolean;
}