# nodejs-opentelemetry

## Steps

1. Run `docker-compose up`.
   It starts the following components:
   * **nodejs-opentelemetry-master:** Entry point (GET http://localhost:3000)
   * **nodejs-opentelemetry-slave:** Intermediary api.
   * **otel-collector:** Proxy to receive data from OpenTelemetry, and then, export to target system (zipkin and elastic).
   * [**zipkin:**](https://zipkin.io/) Local instance.
2. GET http://localhost:3000 to run a request.
3. Open http://localhost:9411 to check traces on zipkin.
4. Open [elastic](https://cloud.elastic.co/home) to check trace there.
   * user: raziel_frex@hotmail.com
   * pass: Patata1234564789
