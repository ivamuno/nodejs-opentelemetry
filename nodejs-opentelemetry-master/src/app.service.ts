import { Injectable } from '@nestjs/common';
import { TracerProvider } from './monitoring/tracerProvider';
import { context } from '@opentelemetry/api';
import axios from 'axios';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    const tracer = TracerProvider.getTracer();
    const child = tracer.startSpan(
      'child_span',
      { attributes: { 'code.function': 'getHello' } },
      context.active(),
    );
    child.setAttribute('alpha', '200');
    child.setAttribute('beta', '50');

    child.end();
    const result = await axios.get(`http://nodejs-opentelemetry-slave:3001`);
    return JSON.stringify(result.data);
  }
}
