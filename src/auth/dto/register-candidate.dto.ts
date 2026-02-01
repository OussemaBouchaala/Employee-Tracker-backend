import { RegisterUserDto } from './register-user.dto';

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterCandidateDto extends RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    description: string;
}
