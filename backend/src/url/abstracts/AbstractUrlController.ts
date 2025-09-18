import { FetchUrlResponse } from "../url.controller";

export abstract class AbstractUrlController {
    abstract fetchUrls(userId: string, page: number, limit: number, search: string): Promise<FetchUrlResponse>;
}
