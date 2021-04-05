const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor, BatchSpanProcessor, ConsoleSpanExporter, BasicTracerProvider } = require('@opentelemetry/tracing');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');
const { CollectorTraceExporter } = require("@opentelemetry/exporter-collector");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");

import opentelemetry from '@opentelemetry/api';

export class TracerProvider {
  static registerNode() {
    const provider = new NodeTracerProvider();

    provider.addSpanProcessor(
      /*new SimpleSpanProcessor(
        new ZipkinExporter({
          serviceName: 'nodejs-opentelemetry-master',
          url: 'http://otel-collector:9411'
        })
      ),*/
      new SimpleSpanProcessor(
        new CollectorTraceExporter({
          serviceName: 'nodejs-opentelemetry-master',
          url: 'http://otel-collector:55681/v1/traces'
        })
      ),
    );

    registerInstrumentations({
      tracerProvider: provider,
      instrumentations: [{
        plugins: {
          express: {
            enabled: true,
          },
          http: {
            ignoreOutgoingUrls: [
              (url: string) => url.includes('apm')
            ],
          }
        },
      }]
    });

    provider.register();
  }

  static getTracer() {
    return opentelemetry.trace.getTracer('TestTracer');
  }
}
