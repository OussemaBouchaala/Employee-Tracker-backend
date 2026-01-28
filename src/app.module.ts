import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';



import { JobPostModule } from './job-post/job-post.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { NotificationService } from './notification/notification.service';
import { NotificationController } from './notification/notification.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    JobPostModule,
    UserModule,
    AdminModule,
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://helmipaty_db_user:GEcR9fLDB40KPY8Z@cluster0.kfxxzgd.mongodb.net/projettp',
      database: 'projettp',
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController, NotificationController],
  providers: [AppService, NotificationService],
})
export class AppModule { }
