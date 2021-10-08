import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CounterMetric, PromService, SummaryMetric } from '@digikare/nestjs-prom';

@Injectable()
export class AppService {
  private readonly _summary: SummaryMetric;
  private readonly _counter: CounterMetric;

  constructor(private readonly promService: PromService) {
    this._summary = this.promService.getSummary({
      name: 'request_processing_seconds',
      help: 'Time spent processing request',
      labelNames: ['path'],
    });

    this._counter = this.promService.getCounter({
      name: 'my_requests',
      help: 'Total requests received',
      labelNames: ['path', 'method', 'status'],
    });
  }

  getIndex(): string {
    const startTimestamp = Date.now();
    const sleep = async () => {
      await this.sleep(Math.random() * 1000);
    };
    const random = Math.random();
    this._counter.labels('/', 'GET', '200').inc(1);
    this._summary.labels('/').observe(Date.now() - startTimestamp);
    return '<p>OK - path: /</p>';
  }

  getRandomFail(): string {
    const startTimestamp = Date.now();
    const sleep = async () => {
      await this.sleep(Math.random() * 1000);
    };

    this._summary.labels('/random').observe(Date.now() - startTimestamp);

    const random = Math.random();
    if (random < 0.5) {
      this._counter.labels('/random', 'GET', '503').inc(1);
      throw new HttpException(
        'Service Unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    } else {
      this._counter.labels('/random', '/GET', '200').inc(1);
      return '<p>OK - path: /random</p>';
    }
  }

  sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
