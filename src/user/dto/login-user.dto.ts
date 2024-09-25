import { IsEmail, isEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email:string;

  @IsString()
  @IsNotEmpty()
  password:string;
}
