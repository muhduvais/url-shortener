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
  ): Promise<fetchUrlsResponse> {
    const urls = await this.urlModel
      .find({ user: userId })
      .skip(skip)
      .limit(limit)
      .lean<IUrl[]>()
      .exec();
    const total = await this.urlModel.countDocuments({ user: userId });
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
}
