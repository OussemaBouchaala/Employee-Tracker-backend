import { Injectable, ConflictException } from '@nestjs/common';
import { API_URL } from '../config/api/api_url';
import { HttpService } from '@nestjs/axios';
import { Observable, map, lastValueFrom } from 'rxjs';
import FormData from 'form-data';
import { InjectRepository } from '@nestjs/typeorm';
import { Recruiter } from './entities/recruiter.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Candidate } from './entities/candidate.entity';
import { User } from './entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';

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
  ) { }

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

  testing_api(): Observable<JSON> {
    return this.httpService.get(API_URL.testingAPIURL).pipe(map(res => res.data));
  }

  embed_CV(cv: Express.Multer.File, userId: string): Observable<any> {
    const formData = new FormData();

    formData.append('cv', cv.buffer, { filename: cv.originalname });
    formData.append('UserId', userId);

    return this.httpService
      .post(API_URL.addUserURL, formData, {
        headers: formData.getHeaders(),
        timeout: 10 * 60 * 1000,
      })
      .pipe(map(res => res.data));
  }

  saveProfilePictureSafely(file: Express.Multer.File): string | undefined {
    if (!file) return undefined;

    // 1. Create the profile-pictures folder if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'profile-pictures');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 2. Generate unique filename and save the file
    // We don't have userId yet if this is called before user creation, so use timestamp + random
    const uniqueFilename = `profile_${Date.now()}_${Math.round(Math.random() * 1E9)}_${file.originalname}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    fs.writeFileSync(filePath, file.buffer);

    return filePath;
  }


  async createCandidate(
    userId: string,
    createCandidateDto: { description: string; cv: string },
    file: Express.Multer.File
  ): Promise<Candidate> {
    // 1. Create the candidateCV folder if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'candidateCV');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 2. Generate unique filename and save the file
    const uniqueFilename = `${userId}_${Date.now()}_${file.originalname}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    fs.writeFileSync(filePath, file.buffer);

    // 3. Create and Save Candidate with file path
    const newCandidate = this.candidateRepository.create({
      userId: new ObjectId(userId),
      description: createCandidateDto.description,
      cv: filePath,
    });

    const savedCandidate = await this.candidateRepository.save(newCandidate);

    void lastValueFrom(this.embed_CV(file, userId))
      .then((embeddingObservable) => console.log(embeddingObservable))
      .catch((error) => console.error('CV embedding service unavailable; continuing without embeddings.', error));

    return savedCandidate;
  }


  async verifyUser(token: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { verificationToken: token } });
    if (!user) {
      throw new ConflictException('Invalid verification token');
    }
    user.verifiedAt = new Date();
    user.verificationToken = null;
    return this.userRepository.save(user);
  }

  async createRecruiter(
    userId: string,
    createRecruiterDto: { companyName: string }
  ): Promise<Recruiter> {
    const newRecruiter = this.recruiterRepository.create({
      userId: new ObjectId(userId),
      companyName: createRecruiterDto.companyName,
    });

    return this.recruiterRepository.save(newRecruiter);
  }
}
