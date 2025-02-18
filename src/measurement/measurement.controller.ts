import { Controller, Get, Param, Query, Render } from '@nestjs/common';
import { MeasurementService } from './measurement.service';
import { SearchDto } from './search.dto';

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

  @Get('search')
  @Render('index')
  async search(@Query() query: SearchDto) {
    const result = await this.measurementService.search(query);
    return { results: result.results, totalCount: result.totalCount, page: result.page, size: result.size };
  }
}