import { RegisterUserDto } from './register-user.dto';

import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterCandidateDto extends RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    cv: string;
}
