import { Controller, Get, Param, Query, Render, Req, Res } from '@nestjs/common';
import { MeasurementService } from './measurement.service';
import { SearchDto } from './search.dto';
import { Request, Response } from 'express';  
@Controller('measurement')
export class MeasurementController {
  constructor(private readonly measurementService: MeasurementService) {}

  @Get('/barcode/:barcode')
  async getRecyclingByBarcode(@Param('barcode') barcode: string) {
      return this.measurementService.getRecyclingByBarcode(barcode);
  }

  @Get('/manufacturer/:manufacturer')
  async getRecyclingByManufacturer(@Param('manufacturer') manufacturer: string) {
      return this.measurementService.getRecyclingByManufacturer(manufacturer);
  }

  @Get('/manufacturer/:manufacturer/details')
  async getDetailedRecyclingByManufacturer(@Param('manufacturer') manufacturer: string) {
      return this.measurementService.getDetailedRecyclingByManufacturer(manufacturer);
  }

  @Get('/category')
    async getAllRecyclingByCategory() {
        return this.measurementService.getAllRecyclingByCategory();
    }

  @Get('/category/:category')
  async getRecyclingByCategory(@Param('category') category: string) {
      return this.measurementService.getRecyclingByCategory(category);
  }

  @Get('/search')
  @Render('index')
  async searchMeasurements(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('q') q?: string,
    @Query('type') type?: string
  ) {
    // 페이지네이션+검색 결과를 가져옴
    const { data, totalCount, currentPage, totalPages } =
      await this.measurementService.getPaginatedSearch(page, limit, q, type);
    // EJS 템플릿에 필요한 데이터 전달
    return {
      results: data,
      currentPage,
      totalPages,
      query: q || '',
      type: type || '',
    };
  }

  @Get('recyclables')
  async getRecyclablesChunk() {
    const allRecyclables = await this.measurementService.getAllRecyclables();

    // 10개씩 묶은 배열로 변환
    const chunkSize = 10;
    const chunks = [];
    for (let i = 0; i < allRecyclables.length; i += chunkSize) {
      const slice = allRecyclables.slice(i, i + chunkSize);
      chunks.push(slice);
    }

    return chunks;
  }
}