import { Injectable } from '@nestjs/common';
import { AbstractUrlRepository } from './abstracts/AbstractUrlRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Url } from './url.schema';
import { Model } from 'mongoose';
import { IUrl } from './interfaces/IUrl';

interface CreateUrl {
    originalUrl: string,
    shortCode: string,
    user: string,
}

@Injectable()
export class UrlRepository extends AbstractUrlRepository {
    constructor(@InjectModel(Url.name) private readonly urlModel: Model<Url>) {
        super();
    }

    async createUrl(createUrlData: CreateUrl): Promise<Url | null> {
        return await this.urlModel.create(createUrlData);
    }

    async fetchUrls(userId: string): Promise<IUrl[]> {
        return this.urlModel.find({ user: userId }).lean<IUrl[]>().exec();
    }

    async getUrlByShortCode(shortCode: string): Promise<IUrl | null> {
        return this.urlModel.findOne({ shortCode }).lean<IUrl | null>().exec();
    }
}