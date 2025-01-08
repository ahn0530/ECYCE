import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecyclablesService } from './recyclables.service';
import { RecyclablesController } from './recyclables.controller';
import { Recyclable } from './recyclable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recyclable])],
  controllers: [RecyclablesController],
  providers: [RecyclablesService],
  exports: [RecyclablesService],
})
export class RecyclablesModule {}