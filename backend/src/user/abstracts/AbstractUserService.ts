import { User } from '../user.schema';
import { IUser } from '../interfaces/IUser';

export abstract class AbstractUserService {
  abstract findById(userId: string): Promise<IUser | null>
}