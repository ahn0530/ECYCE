import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RecyclablesModule } from './recyclables/recyclables.module';
import { HistoryModule } from './history/history.module';
import { RewardsModule } from './rewards/rewards.module';

@Module({
  imports: [UsersModule, RecyclablesModule, HistoryModule, RewardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
