import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AbstractUserRepository } from './abstracts/AbstractUserRepository';
import { IUser } from './interfaces/IUser';
import { STATUS_CODES } from 'src/common/constants/status-codes';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { AbstractUserService } from './abstracts/AbstractUserService';

@Injectable()
export class UserService extends AbstractUserService {
    constructor(
        @Inject('AbstractUserRepository')
        private readonly userRepository: AbstractUserRepository,
    ) {
        super();
    }

    async findById(userId: string): Promise<IUser | null> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException({
                statusCode: STATUS_CODES.NOT_FOUND,
                message: ERROR_MESSAGES.NOT_FOUND,
            })
        }
        return user;
    }
}
