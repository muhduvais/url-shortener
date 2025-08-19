import { Controller, Get, Inject, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { AbstractUserController } from './abstracts/AbstractUserController';
import { AbstractUserService } from './abstracts/AbstractUserService';
import { IUser } from './interfaces/IUser';
import { STATUS_CODES } from 'src/common/constants/status-codes';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

interface UserDetailsResponse {
    statusCode: number;
    message: string;
    data: IUser | null;
}

@Controller('users')
export class UserController implements AbstractUserController {
    constructor(
        @Inject('AbstractUserService')
        private readonly userService: AbstractUserService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get(':userId')
    async fetchUserDetails(@Param('userId') userId: string): Promise<UserDetailsResponse> {
        const user = await this.userService.findById(userId);
        return {
            statusCode: STATUS_CODES.SUCCESS,
            message: 'User found successfully',
            data: user
        }
    }
}