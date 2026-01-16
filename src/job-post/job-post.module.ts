import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { jobPost } from './jobPost.entity';



@Module({imports: [
TypeOrmModule.forFeature(
[jobPost]
)
],})
export class JobPostModule {}
