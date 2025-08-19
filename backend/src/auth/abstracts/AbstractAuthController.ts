import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";

export abstract class AbstractAuthController {
  abstract login(loginDto: LoginDto): Promise<{
    statusCode: number,
    message: string,
    data: {
      userId: string | undefined,
      accessToken: string
    }
  }>;
  abstract register(registerDto: RegisterDto): Promise<{
    statusCode: number,
    message: string,
    data: { userId: string | undefined }
  }>;
}
