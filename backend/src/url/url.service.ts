import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AbstractUrlService } from './abstracts/AbstractUrlService';
import { AbstractUrlRepository } from './abstracts/AbstractUrlRepository';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';

interface UrlData {
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdDate: Date;
}

export interface UrlServiceResponse {
  urls: UrlData[];
  total: number;
  page: number;
  totalPages: number;
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
    const existingUrl = await this.urlRepository.fetchUrl(originalUrl, userId);

    if (existingUrl) {
      throw new InternalServerErrorException('This url is already shortened. You can find it in \'My Urls\'');
    }

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

  async deleteUrl(shortCode: string, userId: string): Promise<string> {
    const deletedUrl = await this.urlRepository.deleteUrl(shortCode, userId);

    if (!deletedUrl) {
      throw new InternalServerErrorException({
        message: 'Failed to remove URL',
      });
    }

    return deletedUrl;
  }

  async fetchUrls(
    userId: string,
    page: number = 1,
    limit: number = 10,
    search: string,
  ): Promise<UrlServiceResponse> {
    const skip = (page - 1) * limit;
    const { urls, total } = await this.urlRepository.fetchUrls(
      userId,
      skip,
      limit,
      search,
    );

    const totalPages = Math.ceil(total / limit);

    return {
      urls: urls.map((url) => ({
        originalUrl: url.originalUrl,
        shortUrl: `${this.configService.get<string>('BASE_URL')}/${url.shortCode}`,
        createdDate: url.createdAt,
        clicks: url.clicks || 0,
      })),
      total,
      page,
      totalPages,
    };
  }

  async getUrlByShortCode(shortCode: string): Promise<string> {
    const url = await this.urlRepository.getUrlByShortCode(shortCode);
    if (!url) {
      throw new InternalServerErrorException({
        message: 'URL not found',
      });
    }
    await this.urlRepository.incrementClicksByOne(shortCode);
    return url.originalUrl;
  }
}
