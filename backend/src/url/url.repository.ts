import { Injectable } from '@nestjs/common';
import { AbstractUrlRepository } from './abstracts/AbstractUrlRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Url } from './url.schema';
import { Model } from 'mongoose';
import { IUrl } from './interfaces/IUrl';

interface CreateUrl {
  originalUrl: string;
  shortCode: string;
  user: string;
}

export interface fetchUrlsResponse {
  urls: IUrl[];
  total: number;
}

@Injectable()
export class UrlRepository extends AbstractUrlRepository {
  constructor(@InjectModel(Url.name) private readonly urlModel: Model<Url>) {
    super();
  }

  async createUrl(createUrlData: CreateUrl): Promise<Url | null> {
    return await this.urlModel.create(createUrlData);
  }

  async fetchUrls(
    userId: string,
    skip: number,
    limit: number,
    search: string,
  ): Promise<fetchUrlsResponse> {
    const query: any = { user: userId };

    if (search && search.trim() !== '') {
      const regex = new RegExp(this.escapeRegex(search), 'i');
      const shortCodeFromSearch = search.split("/").pop() || "";
      query.$or = [{ originalUrl: regex }, { shortCode: shortCodeFromSearch }];
    }

    const urls = await this.urlModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .lean<IUrl[]>()
      .exec();
    const total = await this.urlModel.countDocuments(query);
    return { urls, total };
  }

  async getUrlByShortCode(shortCode: string): Promise<IUrl | null> {
    return await this.urlModel
      .findOne({ shortCode })
      .lean<IUrl | null>()
      .exec();
  }

  async incrementClicksByOne(shortCode): Promise<void> {
    await this.urlModel.findOneAndUpdate(
      { shortCode },
      { $inc: { clicks: 1 } },
    );
  }

  escapeRegex(text: string) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
