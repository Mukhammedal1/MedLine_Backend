import { databaseConfig } from '@config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        type: 'postgres',
        host: databaseConfig.DB_HOST,
        port: databaseConfig.DB_PORT,
        username: databaseConfig.DB_USER,
        password: databaseConfig.DB_PASSWORD,
        database: databaseConfig.DB_NAME,
        entities: [__dirname + `/**/*.entity{.ts,.js}`],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
