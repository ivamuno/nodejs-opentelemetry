import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { TracerProvider } from './monitoring/tracerProvider';
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";

// https://www.elastic.co/guide/en/apm/agent/nodejs/current/custom-stack.html
// https://itnext.io/distributed-tracing-in-your-kibana-with-nodejs-610c9f07b4b4
// https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/examples/express

// https://github.com/open-telemetry/opentelemetry-js/tree/bf99144ad4e4fa38120e896d70e9e5bcfaf27054/examples/collector-exporter-node

async function bootstrap() {
  TracerProvider.registerNode();

  // Setting the default Global logger to use the Console
  // And optionally change the logging level (Defaults to INFO)
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //app.use(logger);

  await app.listen(3000);
}
bootstrap();
