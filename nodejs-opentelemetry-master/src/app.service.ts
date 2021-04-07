import { Injectable } from '@nestjs/common';
import { TracerProvider } from './monitoring/tracerProvider';
import { context, getSpan, Span, SpanContext } from '@opentelemetry/api';
import axios from 'axios';
import { OptlLogger } from './monitoring/logger';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) { }

  async getHello(): Promise<string> {
    const tracer = TracerProvider.getTracer();
    const child: Span = tracer.startSpan(
      'child_span',
      { attributes: { 'code.function': 'getHello' } },
      context.active(),
    );
    child.setAttribute('alpha', '200');
    child.setAttribute('beta', '50');

    new OptlLogger().info('AppServiceLogInfo', { x: 'asd' });

    child.end();
    const result = (await axios.get(`http://nodejs-opentelemetry-slave:3001`)).data;

    this.storeEvent(result);

    return JSON.stringify(result);
  }

  private storeEvent(data: string) {
    const currentSpan: Span = getSpan(context.active());
    const event = new Event();
    event.correlationId = currentSpan.context().traceId;
    event.timeStamp = new Date(Date.now());
    event.data = data;
    this.eventRepository.save(event);
  }
}
