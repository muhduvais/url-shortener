import { UrlServiceResponse } from "../url.service";

export abstract class AbstractUrlService {
    abstract fetchUrls(userId: string, page: number, limit: number, search: string): Promise<UrlServiceResponse>;
    abstract createUrl(originalUrl: string, userId: string): Promise<string>;
    abstract getUrlByShortCode(shortCode: string): Promise<string>;
}
