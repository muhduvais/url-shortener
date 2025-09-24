import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AbstractUrlController } from './abstracts/AbstractUrlController';
import { AbstractUrlService } from './abstracts/AbstractUrlService';
import { STATUS_CODES } from 'src/common/constants/status-codes';
import { CreateUrlDto } from './dto/CreateUrlDto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UrlServiceResponse } from './url.service';

interface UrlResponse {
  statusCode: number;
  message: string;
  data: string;
}

export interface FetchUrlResponse {
  statusCode: number;
  message: string;
  data: UrlServiceResponse;
}

@Controller('urls')
export class UrlController extends AbstractUrlController {
  constructor(
    @Inject('AbstractUrlService')
    private readonly urlService: AbstractUrlService,
  ) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createUrl(
    @Body() createUrlDto: CreateUrlDto,
    @Req() req,
  ): Promise<UrlResponse> {
    const shortUrl = await this.urlService.createUrl(
      createUrlDto.url,
      req.user.userId,
    );
    return {
      statusCode: STATUS_CODES.SUCCESS,
      message: 'Url created successfully',
      data: shortUrl,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async fetchUrls(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string,
  ): Promise<FetchUrlResponse> {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const urlData = await this.urlService.fetchUrls(userId, pageNum, limitNum, search);
    return {
      statusCode: STATUS_CODES.SUCCESS,
      message: 'Urls fetched successfully',
      data: urlData,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':shortCode')
  async deleteUrl(
    @Param('shortCode') shortCode: string,
    @Req() req,
  ): Promise<UrlResponse> {
    const removedUrl = await this.urlService.deleteUrl(
      shortCode,
      req.user.userId,
    );
    return {
      statusCode: STATUS_CODES.SUCCESS,
      message: 'Url removed successfully',
      data: removedUrl,
    };
  }
}
