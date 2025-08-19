import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { UrlRepository } from './url.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, urlSchema } from './url.schema';
import { UrlRedirectController } from './url-redirect.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Url.name, schema: urlSchema }]),
  ],
  controllers: [UrlController, UrlRedirectController],
  providers: [
    {
      provide: 'AbstractUrlService',
      useClass: UrlService,
    },
    {
      provide: 'AbstractUrlRepository',
      useClass: UrlRepository,
    },
  ],
  exports: ['AbstractUrlService', 'AbstractUrlRepository'],
})
export class UrlModule {}
