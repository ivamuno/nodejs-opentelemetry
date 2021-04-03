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
          url: 'http://zipkin:9411/api/v2/spans'
        }),
      ),*/
      new SimpleSpanProcessor(
        new ZipkinExporter({
          serviceName: 'nodejs-opentelemetry-master',
          url: 'http://otel-collector:9411'
        })
      ),
      /*new SimpleSpanProcessor(
        new CollectorTraceExporter({
          serviceName: 'nodejs-opentelemetry-master',
          url: 'http://localhost:55681/v1/trace'
          // HTTP - http://localhost:55681/v1/trace
          // gRPC - localhost:4317
        }),
        {
          maxQueueSize: 2,
          scheduledDelayMillis: 5000,
        }
      ),*/
    );
    
    registerInstrumentations({
      tracerProvider: provider
    });

    provider.register();
  }

  static getTracer() {
    return opentelemetry.trace.getTracer('TestTracer');
  }
}
