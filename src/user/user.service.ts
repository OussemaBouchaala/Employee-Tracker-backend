import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { API_URL } from '../config/api/api_url';
import { HttpService } from '@nestjs/axios';
import { Observable, map, lastValueFrom } from 'rxjs';
import FormData from 'form-data';
import { InjectRepository } from '@nestjs/typeorm';
import { Recruiter } from './entities/recruiter.entity';
import { In, Or, Repository } from 'typeorm';
import { Candidate } from './entities/candidate.entity';
import { User } from './entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import { ApprovalStatus } from 'src/config/user/recruiterStatus';
import { UserRole } from 'src/config/user/userRole';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';                                                                                                                                                        
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';

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

  // 1. User CRUD operations
  async findAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find({
        where: {
          role: In([UserRole.CANDIDATE, UserRole.RECRUITER])
        }
      }
    );
    console.log("users", users);
    return users;
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ id: Number(userId) });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.softRemove(user);
    return { message: 'User deleted successfully' };
  }

  async updateUser(
    userId: string, 
    updateData: UpdateCandidateDto | UpdateRecruiterDto,
    profilePicture?: Express.Multer.File,
    cv?: Express.Multer.File
  ): Promise<User> {
    const user = await this.userRepository.preload({ id: Number(userId), ...updateData });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if(profilePicture){
      if(user.profilePictureUrl){
        this.deletefile(user.profilePictureUrl);
      }
      user.profilePictureUrl = await this.savefile(profilePicture,'profilePictures');
    }
    let updatedUser= await this.userRepository.save(user);
    if(user.role === UserRole.CANDIDATE){
      updatedUser = await this.updateCandidate(userId, updateData as UpdateCandidateDto,cv);
    }
    if(user.role === UserRole.RECRUITER){
      updatedUser = await this.updateRecruiter(userId, updateData as UpdateRecruiterDto);
    }
    
    return updatedUser;    
  }

  async updateCandidate(
    userId: string, 
    updateData: UpdateCandidateDto,
    cvFile?: Express.Multer.File
  ): Promise<Candidate> {
    const candidate = await this.candidateRepository.preload({ id: Number(userId), ...updateData });
    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }
    if(cvFile){
      if(candidate.cv){
        this.deletefile(candidate.cv);
      }
      candidate.cv = await this.savefile(cvFile,'candidateCV');
    }
    return this.candidateRepository.save(candidate);
  }

  async updateRecruiter(userId: string, updateData: UpdateRecruiterDto): Promise<Recruiter> {
    const recruiter = await this.recruiterRepository.preload({ id: Number(userId), ...updateData });
    console.log("recruiter", recruiter);
    console.log("updateData", updateData);
    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }
    if(updateData.companyName){
      console.log("companyName", updateData.companyName);
    }
    console.log("recruiter", recruiter);
    return this.recruiterRepository.save(recruiter);
  }

  findOne(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  create(userData: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  // 2. UPDATED CANDIDATE CREATION
  async createCandidate(
    userId: string,
    createCandidateDto: { description: string },
    cvFile: Express.Multer.File,
  ): Promise<Candidate> {
    // A. Find the base user record
    const user = await this.userRepository.findOneBy({ id: Number(userId) });
    if (!user) throw new NotFoundException('User not found');

    // B. CV File handling
    // const uploadDir = path.join(process.cwd(), 'candidateCV');
    // if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // const uniqueCvFilename = `${userId}_${Date.now()}_cv_${cvFile.originalname}`;
    // const cvFilePath = path.join(uploadDir, uniqueCvFilename);
    // const cvFilePathRelative = path.relative(process.cwd(), cvFilePath);
    // console.log("cv", {cvFile,cvFileBuffer:typeof(cvFile.buffer),cvFilePathRelative});
    // fs.writeFileSync(cvFilePath, cvFile.buffer);
    const cvFilePathRelative = await this.savefile(cvFile,'candidateCV');

    // D. CONVERSION LOGIC
    // In Joined Inheritance, to "convert" a User to a Candidate, we save a 
    // Candidate entity using the SAME ID as the User.
    const newCandidate = this.candidateRepository.create({
      ...user, // This copies name, email, password, and the CRITICAL ID
      description: createCandidateDto.description,
      cv: cvFilePathRelative,
    });

    return this.candidateRepository.save(newCandidate);
  }

  // 3. UPDATED RECRUITER CREATION
  async createRecruiter(
    userId: string,
    createRecruiterDto: { companyName: string },
  ): Promise<Recruiter> {
    const user = await this.userRepository.findOneBy({ id: Number(userId) });
    if (!user) throw new NotFoundException('User not found');

    const newRecruiter = this.recruiterRepository.create({
      ...user, // Copies existing user data including ID
      companyName: createRecruiterDto.companyName,
      approvalStatus: ApprovalStatus.PENDING,
    });

    return this.recruiterRepository.save(newRecruiter);
  }

  //Other helpers
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
      })
      .pipe(map(res => res.data));
  }

  async savefile(file: Express.Multer.File, folderName: string): Promise<string> {
    const uploadDir = path.join(process.cwd(), folderName);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const uniqueFilename = `${Date.now()}_${file.originalname}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    const filePathRelative = path.relative(process.cwd(), filePath);
    console.log("file", {file,fileBuffer:typeof(file.buffer),filePathRelative});
    fs.writeFileSync(filePath, file.buffer);

    return filePathRelative;
  }

  async deletefile(filePath: string): Promise<void> {
    const oldFile = path.join(process.cwd(), filePath);
    if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
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

}
