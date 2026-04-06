import { Controller, Get, Post, Delete, Body, Param, Inject, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AppService } from './app.service';
import { firstValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  @Get('health')
  getHealth(): string {
    return 'Grantify Gateway is Live';
  }

  @Get('api/v1/opportunities')
  async getOpportunities() {
    const cacheKey = 'opportunities_v2';
    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      this.logger.log(`[CACHE HIT] Returning cached opportunities`);
      return cachedData;
    }

    this.logger.log(`[CACHE MISS] Fetching opportunities from AI Service`);
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${aiServiceUrl}/opportunities`)
      );

      await this.cacheManager.set(cacheKey, response.data);
      this.logger.log(`[CACHE SET] Cached opportunities in Redis`);

      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching opportunities: ${error.message}`);
      return [];
    }
  }

  @Post('api/v1/ai/analyze')
  async analyzeTender(@Body() body: any) {
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${aiServiceUrl}/analyze`, body)
      );
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        message: 'AI Service communication failed',
        details: error.message,
        analysis_date: new Date().toISOString()
      };
    }
  }

  @Post('api/v1/chat')
  async chat(@Body() body: any) {
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${aiServiceUrl}/chat`, body)
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error in chat: ${error.message}`);
      return {
        status: 'error',
        message: 'AI Service (Chat) communication failed',
        details: error.message
      };
    }
  }

  @Get('api/v1/chat/history/:sessionId')
  async getChatHistory(@Param('sessionId') sessionId: string) {
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${aiServiceUrl}/chat/history/${sessionId}`)
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching chat history: ${error.message}`);
      return [];
    }
  }

  @Delete('api/v1/chat/history/:sessionId')
  async clearChatHistory(@Param('sessionId') sessionId: string) {
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${aiServiceUrl}/chat/history/${sessionId}`)
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error clearing chat history: ${error.message}`);
      return { status: 'error', message: error.message };
    }
  }

  @Get('api/v1/chat/trace/:sessionId')
  async getChatTrace(@Param('sessionId') sessionId: string) {
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${aiServiceUrl}/chat/trace/${sessionId}`)
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching chat trace: ${error.message}`);
      return { session_id: sessionId, retrieval_chunks: [], system_prompt: 'Trace unavailable' };
    }
  }
}
