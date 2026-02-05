import { PartialType } from "@nestjs/mapped-types";
import { RegisterRecruiterDto } from "src/auth/dto/register-recruiter.dto";

export class UpdateRecruiterDto extends PartialType(RegisterRecruiterDto){
}