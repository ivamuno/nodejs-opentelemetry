const { NodeTracerProvider } = require("@opentelemetry/node");
const { SimpleSpanProcessor } = require("@opentelemetry/tracing");
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");
const { CollectorTraceExporter } = require("@opentelemetry/exporter-collector");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");

import opentelemetry from "@opentelemetry/api";

export class TracerProvider {
  static registerNode() {
    const provider = new NodeTracerProvider();

    /*provider.addSpanProcessor(
      new SimpleSpanProcessor(
        new ZipkinExporter({
          serviceName: 'nodejs-opentelemetry-slave',
          url: 'http://otel-collector:9411'
        })
      ),
    );*/

    provider.addSpanProcessor(
      new SimpleSpanProcessor(
        new CollectorTraceExporter({
          serviceName: 'nodejs-opentelemetry-slave',
          url: 'http://otel-collector:55681/v1/traces'
        })
      )
    );

    registerInstrumentations({
      tracerProvider: provider
    });

    provider.register();
  }

  static getTracer() {
    return opentelemetry.trace.getTracer("TestTracer");
  }
}
