import { IUrl } from "../interfaces/IUrl";
import { Url } from "../url.schema";

interface CreateUrl {
    originalUrl: string,
    shortCode: string,
    user: string,
}

export abstract class AbstractUrlRepository {
    abstract createUrl(createUrlData: CreateUrl): Promise<Url | null>;
    abstract fetchUrls(userId: string): Promise<IUrl[]>
    abstract getUrlByShortCode(shortCode: string): Promise<IUrl | null>;
}
