import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  async create(@Body() createHistoryDto: CreateHistoryDto) {
    return this.historyService.createHistory(createHistoryDto);
  }

  @Get(':userId')
  async getUserHistory(@Param('userId') userId: string) {
    return this.historyService.getUserHistory(userId);
  }

  @Get(':userId/stats')
  async getUserRecyclingStats(@Param('userId') userId: string) {
    return this.historyService.getUserRecyclingStats(userId);
  }

  @Get(':userId/points')
  async getUserPointsHistory(@Param('userId') userId: string) {
    return this.historyService.getUserPointsHistory(userId);
  }
}
