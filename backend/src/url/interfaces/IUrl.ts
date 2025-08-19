import { Types } from "mongoose";

export interface IUrl {
    originalUrl: string;
    shortCode: string;
    user: Types.ObjectId;
    createdAt: Date;
}