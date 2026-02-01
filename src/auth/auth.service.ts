import { Injectable, ConflictException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterCandidateDto } from './dto/register-candidate.dto';
import { RegisterRecruiterDto } from './dto/register-recruiter.dto';
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
  // private async registerUser(registerUserDto: RegisterUserDto, profilePicFile?: Express.Multer.File) {
  //   const { name, email, password, role, phoneNumber} = registerUserDto;

  //   const existingUser = await this.userService.findOne(email);
  //   if (existingUser) {
  //     throw new ConflictException('User with this email already exists');
  //   }

  //   const saltOrRounds = 10;
  //   const hashedPassword = await bcrypt.hash(password, saltOrRounds);
  //   const verificationToken = uuidv4();

  //   // The 'role' property is crucial here as it acts as the 
  //   // discriminator for your Table Inheritance.
  //   const newUser = await this.userService.create({
  //     name,
  //     email,
  //     password: hashedPassword,
  //     role, // This MUST match the UserRole enum
  //     phoneNumber,
  //     profilePictureUrl: profilePictureUrl ?? `https://i.pravatar.cc/150?u=${email}`,
  //     verificationToken,
  //     verifiedAt: null,
  //   });

  //   await this.mailService.sendVerificationEmail(newUser.email, verificationToken);

  //   return newUser;
  // }

  private async registerUser(registerUserDto: RegisterUserDto, profilePicFile?: Express.Multer.File) {
    const { name, email, password, role, phoneNumber } = registerUserDto;

    const existingUser = await this.userService.findOne(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // 1. Handle Profile Picture Saving if it exists
    let finalProfilePicUrl = `https://i.pravatar.cc/150?u=${email}`;
    if (profilePicFile) {
      // We'll assume you create this method in UserService to save to a 'uploads/profiles' folder
      finalProfilePicUrl = await this.userService.savefile(profilePicFile,'profilePictures');
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
      profilePictureUrl: finalProfilePicUrl,
      verificationToken,
      verifiedAt: null,
    });

    await this.mailService.sendVerificationEmail(newUser.email, verificationToken);
    return newUser;
  }

  /**
   * Inscription d'un candidat avec CV et description
   */
  // registerCandidate and registerRecruiter remain largely the same,
  // but they now benefit from the fact that the IDs are synced.
  async registerCandidate(registerCandidateDto: RegisterCandidateDto, cvFile: Express.Multer.File, profilePicFile?: Express.Multer.File) {
    if (!cvFile) {
      throw new ConflictException('CV file is required for candidates');
    }

    const newUser = await this.registerUser(registerCandidateDto, profilePicFile);

    // This calls the improved UserService method we wrote in the previous step
    await this.userService.createCandidate(newUser.id.toString(), registerCandidateDto, cvFile);

    const { password: _, ...result } = newUser;
    return result;
  }

  /**
   * Inscription d'un recruteur avec le nom de l'entreprise
   */
  async registerRecruiter(registerRecruiterDto: RegisterRecruiterDto, profilePicFile?: Express.Multer.File) {
    const newUser = await this.registerUser(registerRecruiterDto, profilePicFile);

    // Traiter les champs spécifiques au recruteur (companyName)
    await this.userService.createRecruiter(newUser.id.toString(), registerRecruiterDto);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = newUser;
    return result;
  }

  async login(user: any ) {
    if (!user.verifiedAt) {
      throw new ConflictException('Email not verified');
    }
    const payload = { id: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyEmail(token: string) {
    return this.userService.verifyUser(token);
  }


}
