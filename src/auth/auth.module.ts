import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Module({
    imports:[
        JwtModule.registerAsync({
            imports: [ConfigModule], // Inject ConfigModule to access environment variables
            inject: [ConfigService], // Inject ConfigService for dynamic config
            useFactory: async (configService: ConfigService) => ({
              secret: configService.get('JWT_SECRET'), // Get secret from environment variables
              signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') }, // Set expiry
            }),
        }),
    ],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {}
