import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'
import type { AbstractUserRepository } from 'src/user/abstracts/AbstractUserRepository';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { STATUS_CODES } from 'src/common/constants/status-codes';
import { AbstractAuthService } from './abstracts/AbstractAuthService';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

interface LoginResponse { 
    userId: string | undefined, 
    accessToken: string 
};

@Injectable()
export class AuthService extends AbstractAuthService {
    constructor(
        @Inject('AbstractUserRepository')
        private readonly userRepository: AbstractUserRepository,
        private readonly jwtService: JwtService,
    ) {
        super();
    }

    async login(loginDto: LoginDto): Promise<LoginResponse> {
        const { email, password } = loginDto;
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException({
                statusCode: STATUS_CODES.UNAUTHORIZED,
                message: ERROR_MESSAGES.INVALID_CREDENTIALS,
            });
        }
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            throw new UnauthorizedException({
                statusCode: STATUS_CODES.UNAUTHORIZED,
                message: ERROR_MESSAGES.INVALID_CREDENTIALS,
            });
        }

        const payload = { email: user.email, sub: user._id?.toString() };
        const accessToken = this.jwtService.sign(payload);

        return { userId: user._id?.toString(), accessToken }
    }

    async register(registerDto: RegisterDto): Promise<{ userId: string | undefined }> {
        console.log('Register called');
        const { name, email, password } = registerDto;
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new ConflictException({
                statusCode: STATUS_CODES.CONFLICT,
                message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
            });
        }
        const hashed = await bcrypt.hash(password, 10);
        const newUser = await this.userRepository.create({ name, email, password: hashed });
        return { userId: newUser._id?.toString() };
    }
}
