import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'ecyce',
  password: process.env.DB_PASSWORD || 'ecyce',
  database: process.env.DB_DATABASE || 'ecyce',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: configService.get('NODE_ENV') !== 'production',
  autoLoadEntities: true,
});