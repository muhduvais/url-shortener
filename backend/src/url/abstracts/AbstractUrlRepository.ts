import { IUrl } from "../interfaces/IUrl";
import { fetchUrlsResponse } from "../url.repository";
import { Url } from "../url.schema";

interface CreateUrl {
    originalUrl: string,
    shortCode: string,
    user: string,
}

export abstract class AbstractUrlRepository {
    abstract createUrl(createUrlData: CreateUrl): Promise<Url | null>;
    abstract fetchUrls(userId: string, skip: number, limit: number, search: string): Promise<fetchUrlsResponse>
    abstract getUrlByShortCode(shortCode: string): Promise<IUrl | null>;
    abstract incrementClicksByOne(shortCode: string): Promise<void>;
}
