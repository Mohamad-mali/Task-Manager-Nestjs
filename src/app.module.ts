import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

//internal Imports
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { Task } from './task/task.entity';
import { WinstonLoggerModule } from '../logger.config';

//custom types

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    WinstonLoggerModule,
    ScheduleModule.forRoot(),
    UserModule,
    TaskModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE as any) || 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER || 'root',
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB || 'TaskManager',
      entities: [User, Task],
      synchronize: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
          },
          ttl: (process.env.TTL as number | undefined) || 60 * 5,
        }),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
