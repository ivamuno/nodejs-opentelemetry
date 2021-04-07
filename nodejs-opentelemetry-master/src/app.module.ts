import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'nodejs-opentelemetry-storage',
      port: 1433,
      username: 'sa',
      password: 'NodejsOtl2021?NodejsOtl',
      database: 'NodejsOtl',
      entities: [Event],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Event])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
