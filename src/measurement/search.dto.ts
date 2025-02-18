import { IsOptional, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchDto {
  @IsString()
  q: string;

  @IsOptional()
  @IsString()
  type?: string; // 'product', 'company' 등 선택적으로 지정

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  size?: number = 10;
}
