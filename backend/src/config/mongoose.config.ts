import { ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const mongooseConfig = (): MongooseModuleAsyncOptions => {
    return {
        useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>('MONGO_URI')
        }),
        inject: [ConfigService],
    }
}