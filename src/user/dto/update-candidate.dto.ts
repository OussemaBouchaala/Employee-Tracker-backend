import { PartialType } from "@nestjs/mapped-types";
import { RegisterCandidateDto } from "src/auth/dto/register-candidate.dto";

export class UpdateCandidateDto extends PartialType(RegisterCandidateDto){
}   