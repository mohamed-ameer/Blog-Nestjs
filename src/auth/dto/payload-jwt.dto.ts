import { IsEmail, IsNotEmpty, IsNumber, IsString, IsEnum } from "class-validator";
import { Role } from "../../roles/role.enum";
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

    @IsEnum(Role)
    @IsNotEmpty()
    role: Role;
}
