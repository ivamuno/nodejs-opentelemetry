import { DiagLogFunction, DiagLogger, context, getSpan } from '@opentelemetry/api';
const winston = require('winston');
const ecsFormat = require('@elastic/ecs-winston-format');
const { ElasticsearchTransport } = require('winston-elasticsearch');

const esTransportOpts = {
  level: 'info',
  clientOpts: {
    node: 'https://93240c290a9c46d390e5cc7a6dcae9cb.apm.us-west1.gcp.cloud.es.io:443',
    cloud: {
      id: 'observability-deployment:dXMtd2VzdDEuZ2NwLmNsb3VkLmVzLmlvJDU1MjlmOGE2NzZjODQzZWViOGZkZjg3YTU3N2VjNzAxJGZjYTBmMTc1NTA2ODQyMjhhMmY5YmIzMjk4YTZlNjFl',
    },
    auth: {
      username: 'elastic',
      password: 'N9Pz9CzSZJvLrsQ7z77mLFyH'
    }
  }
};
const esTransport = new ElasticsearchTransport(esTransportOpts);

const logger = winston.createLogger({
  level: 'info',
  format: ecsFormat({ convertReqRes: true }),
  transports: [
    //new winston.transports.Console(),
    esTransport
  ]
});

export class OptlLogger implements DiagLogger {
  error: DiagLogFunction = (message: string, ...args: unknown[]): void => {
    this.log('error', message, ...args);
  };

  warn: DiagLogFunction = (message: string, ...args: unknown[]): void => {
    this.log('warn', message, ...args);
  };

  info: DiagLogFunction = (message: string, ...args: unknown[]): void => {
    this.log('info', message, ...args);
  };

  debug: DiagLogFunction = (message: string, ...args: unknown[]): void => {
    this.log('debug', message, ...args);
  };

  verbose: DiagLogFunction = (message: string, ...args: unknown[]): void => {
    this.log('verbose', message, ...args);
  };

  private log = (severity: string, message: string, ...args: unknown[]): void => {
    const activeSpan = getSpan(context.active());
    const currentSpanContext = activeSpan ? activeSpan.context() : { traceId: '', spanId: '' };
    const spanContext = { 'trace.id': currentSpanContext.traceId, 'span.id': currentSpanContext.spanId };
    logger.log(severity, message, { ...args, ...{ json_message: { message: { ...spanContext } } } });
  }
}
