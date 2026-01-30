/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';



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
      type: 'mongodb',
      url: 'mongodb+srv://helmipaty_db_user:GEcR9fLDB40KPY8Z@cluster0.kfxxzgd.mongodb.net/projettp',
      database: 'projettp',
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'candidateCV'),
      serveRoot: '/candidateCV',
    }),
  ],
  controllers: [AppController, NotificationController],
  providers: [AppService, NotificationService],
})
export class AppModule { }
