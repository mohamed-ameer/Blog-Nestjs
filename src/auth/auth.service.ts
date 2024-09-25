import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PayloadJwtDto } from './dto/payload-jwt.dto';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}
    generateToken(payload: PayloadJwtDto): string {
        return this.jwtService.sign(payload);
    }
    verifyJwt(token: string): any {
        return this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    }
    hashPassword(password: string): string {
        return bcrypt.hashSync(password, 10);
    }
    comparePassword(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash);
    }
}
