const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
//const { CollectorTraceExporter } = require("@opentelemetry/exporter-collector-grpc");
const { CollectorTraceExporter } = require("@opentelemetry/exporter-collector");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");

import opentelemetry from '@opentelemetry/api';

export class TracerProvider {
  static registerNode() {
    const provider = new NodeTracerProvider();

    provider.addSpanProcessor(
      new SimpleSpanProcessor(
        new CollectorTraceExporter({
          serviceName: 'nodejs-opentelemetry-master',
          // Http
          url: 'http://otel-collector:55681/v1/traces'
          // gRPC - https://github.com/open-telemetry/opentelemetry-collector/issues/1110
          // url: 'http://otel-collector:55680',
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
            enabled: true,
            ignoreOutgoingUrls: [
              (url: string) => url.includes('apm')
            ],
          },
          typeorm: {
            enabled: true,
            path: 'opentelemetry-plugin-typeorm',
          },
        },
      }]
    });

    provider.register();
  }

  static getTracer() {
    return opentelemetry.trace.getTracer('TestTracer');
  }
}
