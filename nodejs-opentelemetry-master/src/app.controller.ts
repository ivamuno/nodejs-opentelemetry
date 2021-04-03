import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TracerProvider } from './monitoring/tracerProvider';
import { context, setSpan } from '@opentelemetry/api';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    const tracer = TracerProvider.getTracer();

    const parent = tracer.startSpan('parent_span');
    parent.setAttribute('alpha', '1000');
    parent.addEvent('custom1');

    const result = context.with(setSpan(context.active(), parent), async () => {
      return await this.appService.getHello();
    });

    parent.setAttribute('beta', '1000');
    parent.addEvent('custom2');

    parent.end();
    return result;
  }
}
