import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm.config';
import { UsersModule } from './users/users.module';
import { RecyclablesModule } from './recyclables/recyclables.module';
import { HistoryModule } from './history/history.module';
import { RewardsModule } from './rewards/rewards.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MeasurementModule } from './measurement/measurement.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),
    UsersModule,
    RecyclablesModule,
    AuthModule,
    HistoryModule,
    RewardsModule,
    MeasurementModule,
  ],
})
export class AppModule {}