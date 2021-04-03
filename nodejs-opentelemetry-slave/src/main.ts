import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { logger } from './monitoring/loggerMiddleware';
import { TracerProvider } from './monitoring/tracerProvider';

// https://www.elastic.co/guide/en/apm/agent/nodejs/current/custom-stack.html
// https://itnext.io/distributed-tracing-in-your-kibana-with-nodejs-610c9f07b4b4
// https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/examples/express

async function bootstrap() {
  TracerProvider.registerNode();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.use(logger);

  await app.listen(3001);
}
bootstrap();
