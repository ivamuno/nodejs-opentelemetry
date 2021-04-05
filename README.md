# nodejs-opentelemetry

## Steps

0. Run `npm i` within **nodejs-opentelemetry-master** and **nodejs-opentelemetry-slave**.
1. Run `docker-compose up`.
   It starts the following components:
   * **nodejs-opentelemetry-master:** Entry point (GET http://localhost:3000)
   * **nodejs-opentelemetry-slave:** Intermediary api.
   * **otel-collector:** Proxy to receive data from OpenTelemetry, and then, export to target system (zipkin and elastic).
   * [**zipkin:**](https://zipkin.io/): Local instance.
   * [**jaeger**](https://www.jaegertracing.io/): Local instance.
   * [**apm-server**](https://www.elastic.co/es/apm/): Local instance.
2. When Compose finishes, navigate to [apm-tutorial](http://localhost:5601/app/kibana#/home/tutorial/apm]. Complete steps 4-6 to configure your application to collect and report APM data. More [details](https://www.elastic.co/guide/en/apm/get-started/current/quick-start-overview.html).
3. GET http://localhost:3000 to run a request.
4. Open http://localhost:9411 to check traces on zipkin.

![image](https://user-images.githubusercontent.com/24419905/113476410-abd9d480-947b-11eb-9c2e-f9d602e2b915.png)

5. Open http://localhost:5601/app/apm to check trace on elastic.

![image](https://user-images.githubusercontent.com/24419905/113476427-c449ef00-947b-11eb-80e4-88df30950314.png)

6. Open http://localhost:16686/search to check trace on jaeger.

![image](https://user-images.githubusercontent.com/24419905/113564577-e6717780-9609-11eb-9f27-951b0ebd70b8.png)
