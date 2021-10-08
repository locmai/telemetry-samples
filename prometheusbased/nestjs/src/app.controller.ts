import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PromSummary, SummaryMetric } from '@digikare/nestjs-prom';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getIndex(): string {
    return this.appService.getIndex();
  }

  @Get('/random')
  getRandomFail(): string {
    return this.appService.getRandomFail();
  }
}
