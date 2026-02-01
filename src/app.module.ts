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
import { dbConfig } from './config/db/database.config';

@Module({
  imports: [
    AuthModule,
    JobPostModule,
    UserModule,
    AdminModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      ssl: true,
      synchronize: true,
      logging: false,
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController, NotificationController],
  providers: [AppService, NotificationService],
})
export class AppModule { }
