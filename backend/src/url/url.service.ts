import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AbstractUrlService } from './abstracts/AbstractUrlService';
import { AbstractUrlRepository } from './abstracts/AbstractUrlRepository';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';

export interface UrlServiceResponse {
    originalUrl: string;
    shortUrl: string;
    createdDate: Date;
}

@Injectable()
export class UrlService extends AbstractUrlService {
    constructor(
        @Inject('AbstractUrlRepository')
        private readonly urlRepository: AbstractUrlRepository,
        private readonly configService: ConfigService,
    ) {
        super();
    }

    async createUrl(originalUrl: string, userId: string): Promise<string> {
        const shortCode = nanoid(8);

        const baseUrl = this.configService.get<string>('BASE_URL');

        if (!baseUrl) {
            throw new InternalServerErrorException('BASE_URL not configured');
        }

        const createdUrl = await this.urlRepository.createUrl({
            originalUrl,
            shortCode,
            user: userId,
        });

        if (!createdUrl) {
            throw new InternalServerErrorException({
                message: 'Failed to create URL',
            });
        }

        return `${baseUrl}/${shortCode}`;
    }

    async fetchUrls(userId: string): Promise<UrlServiceResponse[]> {
        const urls = await this.urlRepository.fetchUrls(userId);
        if (!urls) {
            throw new InternalServerErrorException({
                message: 'Failed to fetch URLs',
            });
        }
        return urls.map(url => ({
            originalUrl: url.originalUrl,
            shortUrl: `${this.configService.get<string>('BASE_URL')}/${url.shortCode}`,
            createdDate: url.createdAt,
        }));
    }

    async getUrlByShortCode(shortCode: string): Promise<string> {
        const url = await this.urlRepository.getUrlByShortCode(shortCode);
        if (!url) {
            throw new InternalServerErrorException({
                message: 'URL not found',
            });
        }
        return url.originalUrl;
    }
}
