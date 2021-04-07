import { context, getSpan, setSpan } from '@opentelemetry/api';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/tracing';
import { WebTracerProvider } from '@opentelemetry/web';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { CollectorTraceExporter } from '@opentelemetry/exporter-collector';
import { B3Propagator } from '@opentelemetry/propagator-b3';
import { registerInstrumentations } from '@opentelemetry/instrumentation';


const providerWithZone = new WebTracerProvider();

registerInstrumentations({
  instrumentations: [
    new XMLHttpRequestInstrumentation({
      ignoreUrls: [/localhost:8090\/sockjs-node/],
      propagateTraceHeaderCorsUrls: [
        'https://httpbin.org/get',
      ],
    }),
  ],
  tracerProvider: providerWithZone,
});

providerWithZone.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
providerWithZone.addSpanProcessor(new SimpleSpanProcessor(new CollectorTraceExporter({
  serviceName: 'nodejs-opentelemetry-master',
  url: 'http://otel-collector:55681/v1/traces'
})));

providerWithZone.register({
  contextManager: new ZoneContextManager(),
  propagator: new B3Propagator(),
});

const webTracerWithZone = providerWithZone.getTracer('example-tracer-web');

const getData = (url) => new Promise((resolve, reject) => {
  // eslint-disable-next-line no-undef
  const req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.setRequestHeader('Accept', 'application/json');
  req.setRequestHeader("Access-Control-Allow-Origin", '*');
  req.setRequestHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  req.setRequestHeader("Access-Control-Allow-Credentials", "true");
  req.onload = () => {
    resolve();
  };
  req.onerror = () => {
    reject();
  };
  req.send();
});

// example of keeping track of context between async operations
const prepareClickEvent = () => {
  const url1 = 'http://localhost:3000';

  const element = document.getElementById('button1');

  const onClick = () => {
    for (let i = 0, j = 1; i < j; i += 1) {
      const span1 = webTracerWithZone.startSpan(`files-series-info-${i}`);
      context.with(setSpan(context.active(), span1), () => {
        getData(url1).then((_data) => {
          getSpan(context.active()).addEvent('fetching-span1-completed');
          span1.end();
        }, ()=> {
          getSpan(context.active()).addEvent('fetching-error');
          span1.end();
        });
      });
    }
  };
  element.addEventListener('click', onClick);
};

window.addEventListener('load', prepareClickEvent);
