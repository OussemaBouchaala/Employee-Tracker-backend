import { RegisterUserDto } from './register-user.dto';

import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterRecruiterDto extends RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    companyName: string;
}
