const express = require("express");
const { PrometheusExporter } = require("@opentelemetry/exporter-prometheus");
const { MeterProvider } = require("@opentelemetry/sdk-metrics-base");

const prometheusPort = 9091;
const options = { port: prometheusPort, startServer: true };
const exporter = new PrometheusExporter(options);

const meter = new MeterProvider({
  exporter,
  interval: 1000,
}).getMeter("prometheus");

const valueRecorder = meter.createValueRecorder("request_processing_seconds", {
  description: "Time spent processing request",
});
const counter = meter.createCounter("my_requests", {
  description: "Total requests received",
});

const app = express();
const port = 8080;
const host = "0.0.0.0";

app.get("/", (req, res) => {
  const startTimestamp = Date.now();
  const sleep = async () => { await sleep(Math.random() * 1000); }
  const latency = Date.now() - startTimestamp;
  valueRecorder.bind({ path: "/", method: "GET", status: 200 }).record(latency);
  counter.bind({ path: "/", method: "GET", status: 200 }).add(1);
  res.send("<p>OK - path: /</p>");
});

app.get("/random", (req, res) => {
  const startTimestamp = Date.now();
  const random = Math.random();
  const sleep = async () => {
    await sleep(Math.random() * 1000);
  };
  const latency = Date.now() - startTimestamp;
  if (random < 0.5) {
    valueRecorder
      .bind({ path: "/", method: "GET", status: 503 })
      .record(latency);
    counter.bind({ path: "/random", method: "GET", status: 503 }).add(1);
    res.status(503).send("<p>HTTP Error 503</p>");  
  } else {
    valueRecorder.bind({ path: "/", method: "GET", status: 200 }).record(latency);
    counter.bind({ path: "/random", method: "GET", status: 200 }).add(1);
    res.send("<p>OK - path: /random</p>");
  }
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

app.listen(port, host, () => {
  console.log(`> Metrics are exposed at http://${host}:${prometheusPort}/metrics`);
  console.log(`> Telemetry app listening at http://${host}:${port}`);
});


