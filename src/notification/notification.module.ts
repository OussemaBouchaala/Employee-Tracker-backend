import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { User } from '../user/entities/user.entity';
import { Recruiter } from '../user/entities/recruiter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User, Recruiter])],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
