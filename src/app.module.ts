/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPostModule } from './job-post/job-post.module';


@Module({
  imports: [UserModule,
    TypeOrmModule.forRoot({
      type: 'mongodb',
  url: 'mongodb+srv://helmipaty_db_user:GEcR9fLDB40KPY8Z@cluster0.kfxxzgd.mongodb.net/projettp',
  database: 'projettp',
  synchronize: true,
  logging: true,
 autoLoadEntities: true,
    }),
    JobPostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
