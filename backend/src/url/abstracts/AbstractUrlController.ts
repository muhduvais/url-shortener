import { IUrl } from "../interfaces/IUrl";
import { FetchUrlResponse } from "../url.controller";

export abstract class AbstractUrlController {
    abstract fetchUrls(userId: string): Promise<FetchUrlResponse>;
}
