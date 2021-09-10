from flask import Flask, abort
import random
from opentelemetry.exporter.otlp.proto.grpc.exporter import OTLPExporterMixin
from opentelemetry.proto.metrics.v1 import metrics_pb2

app = Flask(__name__)

@app.route("/")
def index():
    return "<p>OK - path: /</p>"

@app.route('/random')
def randomly_fail():
    if random.random() < 0.5:
        abort(503)
    return "<p>OK - path: /random</p>"

if __name__ == '__main__':
    otlp_exporter = OTLPExporterMixin(endpoint="http://localhost:4317", insecure=True)  
    dummy = metrics_pb2.Gauge()
    otlp_exporter._export(dummy)
    app.run(debug=True,host='0.0.0.0', port=8080,threaded=True)