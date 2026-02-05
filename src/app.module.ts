/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';



import { JobPostModule } from './job-post/job-post.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    JobPostModule,
    UserModule,
    NotificationModule,
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
