from datetime import datetime
import random

from flask import Flask, abort

import statsd


statsd_client = statsd.StatsClient('0.0.0.0', 9125)

app = Flask(__name__)

# s = Summary('request_processing_seconds', 'Time spent processing request', ['path'])
# c = Counter('my_requests', 'Total requests received', ['path','method', 'status'])

def timer(path):
    def wrap(func):
        def wrapped_f(*args):
            start = datetime.utcnow()
            func()
            statsd_client.timing('request_processing_seconds',datetime.utcnow() - start, tags = {'path': path})
        return wrapped_f
    return wrap

@timer("/")
@app.route("/")
def index():
    statsd_client.incr('my_requests', 1, tags = {'path':'/', 'method': 'GET', 'status': '200'})
    return "<p>OK - path: /</p>"

@timer("/random")
@app.route('/random')
def randomly_fail():
    if random.random() < 0.5:
        statsd_client.incr('my_requests', 1, tags = {'path':'/random', 'method': 'GET', 'status': '503'})
        abort(503)
    statsd_client.incr('my_requests', 1, tags = {'path':'/random', 'method': 'GET', 'status': '200'})
    return "<p>OK - path: /random</p>"

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=8080,threaded=True)