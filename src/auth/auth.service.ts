import { Injectable, ConflictException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterCandidateDto } from './dto/register-candidate.dto';
import { RegisterRecruiterDto } from './dto/register-recruiter.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { MailService } from '../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Méthode générale pour créer un utilisateur de base
   */
  private async registerUser(registerUserDto: RegisterUserDto) {
    const { name, email, password, role, phoneNumber, profilePictureUrl } = registerUserDto;

    const existingUser = await this.userService.findOne(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const verificationToken = uuidv4();

    const newUser = await this.userService.create({
      name,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      profilePictureUrl: profilePictureUrl ?? `https://i.pravatar.cc/150?u=${email}`,
      verificationToken,
      verifiedAt: null,
    });

    await this.mailService.sendVerificationEmail(newUser.email, verificationToken);

    return newUser;
  }

  /**
   * Inscription d'un candidat avec CV et description
   */
  async registerCandidate(registerCandidateDto: RegisterCandidateDto, file: Express.Multer.File) {
    if (!file) {
      throw new ConflictException('CV file is required for candidates');
    }

    const newUser = await this.registerUser(registerCandidateDto);

    // Traiter les champs spécifiques au candidat
    await this.userService.createCandidate(newUser._id.toString(), registerCandidateDto, file);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = newUser;
    return result;
  }

  /**
   * Inscription d'un recruteur avec le nom de l'entreprise
   */
  async registerRecruiter(registerRecruiterDto: RegisterRecruiterDto) {
    const newUser = await this.registerUser(registerRecruiterDto);

    // Traiter les champs spécifiques au recruteur (companyName)
    await this.userService.createRecruiter(newUser._id.toString(), registerRecruiterDto);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = newUser;
    return result;
  }

  async login(user: any ) {
    if (!user.verifiedAt) {
      throw new ConflictException('Email not verified');
    }
    const payload = { id: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyEmail(token: string) {
    return this.userService.verifyUser(token);
  }
}