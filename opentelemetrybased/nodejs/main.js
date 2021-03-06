"use strict";
const express = require("express");
const { DiagConsoleLogger, DiagLogLevel, diag } = require("@opentelemetry/api");

const { MeterProvider } = require("@opentelemetry/sdk-metrics-base");
const { OTLPMetricExporter } = require("@opentelemetry/exporter-otlp-http");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const metricExporter = new OTLPMetricExporter({
  // url: 'http://localhost:55681/v1/metrics',
});

const meter = new MeterProvider({
  exporter: metricExporter,
  interval: 1000,
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "basic-metric-service",
  }),
}).getMeter("example-exporter-collector");

const valueRecorder = meter.createValueRecorder("request_processing_seconds", {
  description: "Time spent processing request",
  boundaries: [1, 95, 100],
});
const counter = meter.createCounter("my_requests", {
  description: "Total requests received",
});

const app = express();
const port = 8080;
const host = "0.0.0.0";

app.get("/", (req, res) => {
  const startTimestamp = Date.now();
  const sleep = async () => {
    await sleep(Math.random() * 1000);
  };
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
      .bind({ path: "/random", method: "GET", status: 503 })
      .record(latency);
    counter.bind({ path: "/random", method: "GET", status: 503 }).add(1);
    res.status(503).send("<p>HTTP Error 503</p>");
  } else {
    valueRecorder
      .bind({ path: "/random", method: "GET", status: 200 })
      .record(latency);
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
  console.log(`> Telemetry app listening at http://${host}:${port}`);
});
