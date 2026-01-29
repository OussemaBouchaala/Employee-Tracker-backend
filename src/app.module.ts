/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';



import { JobPostModule } from './job-post/job-post.module';
import { UserModule } from './user/user.module';
import { NotificationService } from './notification/notification.service';
import { NotificationController } from './notification/notification.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    JobPostModule,
    UserModule,
   TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'ep-misty-sound-ahhpx1he-pooler.c-3.us-east-1.aws.neon.tech',
  port: 5432,
  username: 'neondb_owner',
  password: 'npg_SFEQ2gWsZU1u',
  database: 'neondb',
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: true,
  logging: true,
  autoLoadEntities: true,})
  ],
  controllers: [AppController, NotificationController],
  providers: [AppService, NotificationService],
})
export class AppModule { }
