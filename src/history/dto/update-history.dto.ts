import { PartialType } from '@nestjs/mapped-types';
import { CreateHistoryDto } from './create-history.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

// export class UpdateHistoryDto extends PartialType(CreateHistoryDto) {}
export class UpdateHistoryDto {
    @IsOptional()
    @IsString()
    category?: string;
  
    @IsOptional()
    @IsNumber()
    points?: number;
  
    @IsOptional()
    @IsNumber()
    count?: number;
  }