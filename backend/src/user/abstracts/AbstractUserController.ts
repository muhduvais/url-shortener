import { IUser } from "../interfaces/IUser";

export abstract class AbstractUserController {
    abstract fetchUserDetails(userId: string): Promise<{
        statusCode: number;
        message: string;
        data: IUser | null;
    }>;
}
