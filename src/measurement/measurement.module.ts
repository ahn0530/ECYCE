import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeasurementController } from './measurement.controller';
import { MeasurementService } from './measurement.service';
import { History } from '../history/history.entity';
import { Recyclable } from '../recyclables/recyclable.entity';
import { RecyclablesModule } from '@src/recyclables/recyclables.module';
import { HistoryModule } from '@src/history/history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([History, Recyclable]),
    forwardRef(() => HistoryModule), 
    forwardRef(() => RecyclablesModule),
  ],  
  controllers: [MeasurementController],
  providers: [MeasurementService],
})
export class MeasurementModule {}
