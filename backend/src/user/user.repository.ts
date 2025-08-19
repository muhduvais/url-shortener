import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { AbstractUserRepository } from './abstracts/AbstractUserRepository';
import { IUser } from './interfaces/IUser';

@Injectable()
export class UserRepository extends AbstractUserRepository {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {
        super();
    }

    async findById(userId: string): Promise<IUser | null> {
        const user = await this.userModel.findById(userId).lean().exec();
        return user as IUser | null;
    }

    async findByEmail(email: string): Promise<IUser | null> {
        const user = await this.userModel.findOne({ email }).lean().exec();
        return user as IUser | null;
    }

    async create(user: Partial<User>): Promise<IUser> {
        console.log('user: ', user)
        const created = await this.userModel.create(user);
        console.log('created: ', created);
        return created.toObject() as IUser;
    }
}