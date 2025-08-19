import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";

export abstract class AbstractAuthService {
    abstract login(loginDto: LoginDto): Promise<{
        userId: string | undefined,
        accessToken: string
    }>;
    abstract register(registerDto: RegisterDto): Promise<{ userId: string | undefined }>;
}
