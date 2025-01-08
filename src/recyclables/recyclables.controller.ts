import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecyclablesService } from './recyclables.service';
import { CreateRecyclableDto } from './dto/create-recyclable.dto';
import { UpdateRecyclableDto } from './dto/update-recyclable.dto';

@Controller('recyclables')
export class RecyclablesController {
  constructor(private readonly recyclablesService: RecyclablesService) {}

  @Post()
  create(@Body() createRecyclableDto: CreateRecyclableDto) {
    return this.recyclablesService.create(createRecyclableDto);
  }

  @Get()
  findAll() {
    return this.recyclablesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recyclablesService.findOne(+id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.recyclablesService.findByUser(+userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecyclableDto: UpdateRecyclableDto) {
    return this.recyclablesService.update(+id, updateRecyclableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recyclablesService.remove(+id);
  }
}