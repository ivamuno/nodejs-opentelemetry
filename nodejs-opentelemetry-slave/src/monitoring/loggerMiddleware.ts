import { Request, Response, NextFunction } from 'express';

const { MeterProvider, ConsoleMetricExporter } = require('@opentelemetry/metrics');
const exporter = new ConsoleMetricExporter();
const meter = new MeterProvider({
  exporter,
  interval: 5000
}).getMeter('your-meter-name');
const requestCount = meter.createCounter('requests', { description: 'Count all incoming requests' });
const boundInstruments = new Map();

export function logger(req: Request, res: Response, next: NextFunction) {
  if (!boundInstruments.has(req.path)) {
    const labels = { route: req.path };
    const boundCounter = requestCount.bind(labels);
    boundInstruments.set(req.path, boundCounter);
  }
  boundInstruments.get(req.path).add(1);
  next();
}
