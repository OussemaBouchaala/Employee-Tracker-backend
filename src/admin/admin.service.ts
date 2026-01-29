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

  async approveRecruiter(recruiterId: string): Promise<Recruiter> {
    const recruiter = await this.recruiterRepository.findOne({
      where: { id: Number(recruiterId) },
      relations: ['user'],
    });
    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }
    recruiter.approvalStatus = 'approved';
    recruiter.rejectionReason = '';
    return this.recruiterRepository.save(recruiter);
  }

  async rejectRecruiter(recruiterId: string, reason?: string): Promise<Recruiter> {
    const recruiter = await this.recruiterRepository.findOne({
      where: { id: Number(recruiterId) },
      relations: ['user'],
    });
    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }
    recruiter.approvalStatus = 'rejected';
    recruiter.rejectionReason = reason || 'No reason provided';
    return this.recruiterRepository.save(recruiter);
  }

  async getPendingRecruiters(): Promise<Recruiter[]> {
    return this.recruiterRepository.find({
      where: { approvalStatus: 'pending' } as any,
      relations: ['user'],
    });
  }

  async getApprovedRecruiters(): Promise<Recruiter[]> {
    return this.recruiterRepository.find({
      where: { approvalStatus: 'approved' } as any,
      relations: ['user'],
    });
  }

  async getRejectedRecruiters(): Promise<Recruiter[]> {
    return this.recruiterRepository.find({
      where: { approvalStatus: 'rejected' } as any,
      relations: ['user'],
    });
  }

  async deleteRecruiter(recruiterId: string): Promise<{ message: string }> {
    const recruiter = await this.recruiterRepository.findOne({
      where: { id: Number(recruiterId) },
    });
    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }
    await this.recruiterRepository.softRemove(recruiter);
    return { message: 'Recruiter deleted successfully' };
  }

  async deleteCandidate(candidateId: string): Promise<{ message: string }> {
    const candidate = await this.candidateRepository.findOne({
      where: { id: Number(candidateId) },
    });
    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }
    await this.candidateRepository.softRemove(candidate);
    return { message: 'Candidate deleted successfully' };
  }
}
