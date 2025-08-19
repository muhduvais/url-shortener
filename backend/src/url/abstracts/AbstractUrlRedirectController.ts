import { Response } from "express";

export abstract class AbstractUrlRedirectController {
    abstract redirect(shortCode: string, res: Response): Promise<void>;
}
