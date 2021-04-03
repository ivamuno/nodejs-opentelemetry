import { Injectable } from '@nestjs/common';
import { TracerProvider } from './monitoring/tracerProvider';
import { context, setSpan, getSpan } from '@opentelemetry/api';
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
    child.setAttribute('alpha', '11100');
    child.setAttribute('beta', '33330');

    child.end();
    const result = await axios.get(`https://jsonplaceholder.typicode.com/todos/1`);
    console.log('result.data', result.data);
    return JSON.stringify(result.data);
  }
}
