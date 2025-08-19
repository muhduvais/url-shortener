import { User } from '../user.schema';
import { IUser } from '../interfaces/IUser';

export abstract class AbstractUserRepository {
  abstract findById(userId: string): Promise<IUser | null>
  abstract findByEmail(email: string): Promise<IUser | null>;
  abstract create(user: Partial<User>): Promise<IUser>;
}