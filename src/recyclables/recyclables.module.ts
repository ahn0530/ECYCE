import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecyclablesService } from './recyclables.service';
import { RecyclablesController } from './recyclables.controller';
import { Recyclable } from './recyclable.entity';
import { HistoryModule } from '@src/history/history.module';
import { MeasurementModule } from '@src/measurement/measurement.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recyclable]),
  forwardRef(() => HistoryModule),
  forwardRef(() => MeasurementModule)
],
  controllers: [RecyclablesController],
  providers: [RecyclablesService],
  exports: [RecyclablesService, TypeOrmModule],
})
export class RecyclablesModule {}