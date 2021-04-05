# nodejs-opentelemetry

## Steps

0. Run `npm i` within **nodejs-opentelemetry-master** and **nodejs-opentelemetry-slave**.
1. Run `docker-compose up`.
   It starts the following components:
   * **nodejs-opentelemetry-master:** Entry point (GET http://localhost:3000)
   * **nodejs-opentelemetry-slave:** Intermediary api.
   * **otel-collector:** Proxy to receive data from OpenTelemetry, and then, export to target system (zipkin and elastic).
   * [**zipkin:**](https://zipkin.io/) Local instance.
   * [**jaeger**](https://www.jaegertracing.io/) Local instance.
2. GET http://localhost:3000 to run a request.
3. Open http://localhost:9411 to check traces on zipkin.

![image](https://user-images.githubusercontent.com/24419905/113476410-abd9d480-947b-11eb-9c2e-f9d602e2b915.png)

4. Open [elastic](https://cloud.elastic.co/home) to check trace there.
   * user: raziel_frex@hotmail.com
   * pass: Patata1234564789

![image](https://user-images.githubusercontent.com/24419905/113476427-c449ef00-947b-11eb-80e4-88df30950314.png)

5. Open http://localhost:16686/search to check trace on jaeger.

![image](https://user-images.githubusercontent.com/24419905/113564577-e6717780-9609-11eb-9f27-951b0ebd70b8.png)
