import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm.config';
import { UsersModule } from './users/users.module';
import { RecyclablesModule } from './recyclables/recyclables.module';
import { HistoryModule } from './history/history.module';
import { RewardsModule } from './rewards/rewards.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),
    UsersModule,
    RecyclablesModule,
    HistoryModule,
    RewardsModule,
  ],
})
export class AppModule {}