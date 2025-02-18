import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Put } from '@nestjs/common';
import { RecyclablesService } from './recyclables.service';
import { CreateRecyclableDto } from './dto/create-recyclable.dto';
import { UpdateRecyclableDto } from './dto/update-recyclable.dto';

@Controller('recyclables')
export class RecyclablesController {
  constructor(private recyclablesService: RecyclablesService) {}

  @Post()
  create(@Body() createRecyclableDto: CreateRecyclableDto) {
    return this.recyclablesService.create(createRecyclableDto);
  }

  @Get()
  findAll() {
    return this.recyclablesService.findAll();
  }

  @Get(':barcode')
  async findOne(@Param('barcode') barcode: string) {
    const recyclable = await this.recyclablesService.findByBarcode(barcode);
    if (!recyclable) {
      throw new NotFoundException('해당 바코드의 재활용품을 찾을 수 없습니다.');
    }
    return recyclable;
  }

  @Put(':barcode')
  async update(@Param('barcode') barcode: string, @Body() updateRecyclableDto: UpdateRecyclableDto) {
    const updated = await this.recyclablesService.update(barcode, updateRecyclableDto);
    if (!updated) {
      throw new NotFoundException('업데이트할 재활용품을 찾을 수 없습니다.');
    }
    return updated;
  }

  @Delete(':barcode')
  async remove(@Param('barcode') barcode: string) {
    const deleted = await this.recyclablesService.remove(barcode);
    if (!deleted) {
      throw new NotFoundException('삭제할 재활용품을 찾을 수 없습니다.');
    }
    return deleted;
  }
}