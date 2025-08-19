import { Controller, Get, Inject, Param, Res, UseGuards } from "@nestjs/common";
import { AbstractUrlService } from "./abstracts/AbstractUrlService";
import { AbstractUrlRedirectController } from "./abstracts/AbstractUrlRedirectController";
import type { Response } from "express";

@Controller()
export class UrlRedirectController extends AbstractUrlRedirectController {
    constructor(
        @Inject('AbstractUrlService')
        private readonly urlService: AbstractUrlService
    ) {
        super();
    }

    @Get(':shortCode')
    async redirect(@Param('shortCode') shortCode: string, @Res() res: Response): Promise<void> {
        const originalUrl = await this.urlService.getUrlByShortCode(shortCode);
        res.redirect(originalUrl)
    }
}
