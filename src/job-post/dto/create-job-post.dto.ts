import { IsNotEmpty, IsString } from "class-validator";

export class CreateJobPostDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    employmentType: string;

    @IsNotEmpty()
    @IsString()
    requirements: string;

    @IsNotEmpty()
    @IsString()
    industries: string;

    @IsNotEmpty()
    @IsString()
    jobFunction: string;

    @IsNotEmpty()
    @IsString()
    seniorityLevel: string;
}
