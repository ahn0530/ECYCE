import { Module } from '@nestjs/common';
import { RecyclablesController } from './recyclables.controller';
import { RecyclablesService } from './recyclables.service';

@Module({
  controllers: [RecyclablesController],
  providers: [RecyclablesService]
})
export class RecyclablesModule {}
