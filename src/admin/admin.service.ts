import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recruiter } from '../user/entities/recruiter.entity';
import { Candidate } from '../user/entities/candidate.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Recruiter)
    private recruiterRepository: Repository<Recruiter>,
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
  ) {}

  // --- RECRUITER MANAGEMENT ---

  async approveRecruiter(recruiterId: string): Promise<Recruiter> {
    // With inheritance, 'id' is shared. 
    // This finds the Recruiter AND the associated User data automatically.
    const recruiter = await this.recruiterRepository.findOneBy({ id: Number(recruiterId) });
    
    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }
    
    recruiter.approvalStatus = 'approved';
    recruiter.rejectionReason = '';
    return this.recruiterRepository.save(recruiter);
  }

  async rejectRecruiter(recruiterId: string, reason?: string): Promise<Recruiter> {
    const recruiter = await this.recruiterRepository.findOneBy({ id: Number(recruiterId) });
    
    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }
    
    recruiter.approvalStatus = 'rejected';
    recruiter.rejectionReason = reason || 'No reason provided';
    return this.recruiterRepository.save(recruiter);
  }

  async getPendingRecruiters(): Promise<Recruiter[]> {
    return this.recruiterRepository.find({
      where: { approvalStatus: 'pending' },
    });
  }

  async getApprovedRecruiters(): Promise<Recruiter[]> {
    return this.recruiterRepository.find({
      where: { approvalStatus: 'approved' },
    });
  }

  async getRejectedRecruiters(): Promise<Recruiter[]> {
    return this.recruiterRepository.find({
      where: { approvalStatus: 'rejected' },
    });
  }

  // --- DELETION LOGIC (The Clean Way) ---

  async deleteRecruiter(recruiterId: string): Promise<{ message: string }> {
    const recruiter = await this.recruiterRepository.findOneBy({ id: Number(recruiterId) });

    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }

    // Because Recruiter extends User/Timestamp, softRemove handles the 
    // deletedAt column in the User table automatically.
    await this.recruiterRepository.softRemove(recruiter);
    return { message: 'Recruiter (and associated User) soft-deleted successfully' };
  }

  async deleteCandidate(candidateId: string): Promise<{ message: string }> {
    const candidate = await this.candidateRepository.findOneBy({ id: Number(candidateId) });

    if (!candidate) {
      throw new NotFoundException('Candidate not found'); 
    }

    // No more manual user fetching! 
    // The candidate object already contains the user identity.
    await this.candidateRepository.softRemove(candidate);
    return { message: 'Candidate (and associated User) soft-deleted successfully' };
  }
}