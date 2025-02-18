import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { History } from './history.entity';
import { Recyclable } from 'src/recyclables/recyclable.entity';
import { User } from 'src/users/user.entity';
import { RecyclablesModule } from '@src/recyclables/recyclables.module';
import { MeasurementModule } from '@src/measurement/measurement.module';

@Module({
  imports: [TypeOrmModule.forFeature([History, User]), 
  forwardRef(() => RecyclablesModule),
  forwardRef(() => MeasurementModule)],
  controllers: [HistoryController],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}