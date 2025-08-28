import { Types } from "mongoose";

export interface IUrl {
    originalUrl: string;
    shortCode: string;
    clicks: number;
    user: Types.ObjectId;
    createdAt: Date;
}