import { Body, Controller, Inject, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AbstractAuthController } from './abstracts/AbstractAuthController';
import { AbstractAuthService } from './abstracts/AbstractAuthService';
import { STATUS_CODES } from 'src/common/constants/status-codes';

interface LoginResponse {
    statusCode: number,
    message: string,
    data: { userId: string | undefined, accessToken: string }
};

interface RegisterResponse {
    statusCode: number,
    message: string,
    data: { userId: string | undefined }
};

@Controller('auth')
export class AuthController extends AbstractAuthController {
    constructor(
        @Inject('AbstractAuthService')
        private readonly authService: AbstractAuthService
    ) {
        super();
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
        const result = await this.authService.login(loginDto);
        return {
            statusCode: STATUS_CODES.SUCCESS,
            message: 'Login successful',
            data: result,
        }
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto): Promise<RegisterResponse> {
        const result = await this.authService.register(registerDto);
        return {
            statusCode: STATUS_CODES.CREATED,
            message: 'Registration successful',
            data: { userId: result.userId }
        }
    }
}
