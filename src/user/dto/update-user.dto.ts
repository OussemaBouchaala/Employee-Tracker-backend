
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { IsOptional, IsString } from "class-validator";
import { RegisterUserDto } from "src/auth/dto/register-user.dto";

export class UpdateUserDto extends OmitType(PartialType(RegisterUserDto), ['email', 'password', 'role']){
  // Recruiter-specific field
  @IsOptional()
  @IsString()
  companyName?: string;

  // Candidate-specific field
  @IsOptional()
  @IsString()
  description?: string;
}