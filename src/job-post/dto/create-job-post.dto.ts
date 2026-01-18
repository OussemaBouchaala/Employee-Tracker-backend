import { IsNotEmpty, IsString } from "class-validator";

export class CreateJobPostDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    companyName: string;

    @IsNotEmpty()
    @IsString()
    requirements: string;

    @IsNotEmpty()
    @IsString()
    industries: string;
}
