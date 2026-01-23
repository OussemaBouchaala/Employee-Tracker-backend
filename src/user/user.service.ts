import { Injectable } from '@nestjs/common';
import { API_URL } from '../config/api/api_url';
import { HttpService } from '@nestjs/axios';
import { Observable, map } from 'rxjs';
import FormData from 'form-data';
import { InjectRepository } from '@nestjs/typeorm';
import { Recruiter } from './entities/recruiter.entity';
import { Repository } from 'typeorm';
import { Candidate } from './entities/candidate.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Recruiter)
    private recruiterRepository: Repository<Recruiter>,
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAllRecruiters(): Promise<Recruiter[]> {
    return this.recruiterRepository.find();
  }

  findAllCandidates(): Promise<Candidate[]> {
    return this.candidateRepository.find();
  }

  async findOne(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  testing_api():Observable<JSON> {
    return this.httpService.get(API_URL.testingAPIURL).pipe(map(res => res.data));
  
    
  }
  
  embed_CV(cv: Express.Multer.File, userId: string): Observable<any> {
    const formData = new FormData();
  
    formData.append('cv', cv.buffer, { filename: cv.originalname });
    formData.append('UserId', userId);

    return this.httpService
      .post(API_URL.addUserURL, formData, {
        headers: formData.getHeaders(),
      })
      .pipe(map(res => res.data));
  }




 
}
