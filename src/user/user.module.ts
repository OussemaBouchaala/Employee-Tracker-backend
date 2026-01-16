import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Candidate } from './candidate.entity';
import { Admin } from './admin.entity';
import { Recruiter } from './recruiter.entity';

@Module({
    imports: [
TypeOrmModule.forFeature(
[User,Candidate,Admin,Recruiter]
)
],
})
export class UserModule {
    
}
