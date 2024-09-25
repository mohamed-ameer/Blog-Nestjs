import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
export class PayloadJwtDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;
    
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
}
