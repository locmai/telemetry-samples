from prometheus_client import make_wsgi_app, Summary, Counter
from flask import Flask, abort
from werkzeug.middleware.dispatcher import DispatcherMiddleware
import random

app = Flask(__name__)

app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
    '/metrics': make_wsgi_app()
})

s = Summary('request_processing_seconds', 'Time spent processing request', ['path'])
c = Counter('my_requests', 'Total requests received', ['path','method', 'status'])

@s.labels('/').time()
@app.route("/")
def index():
    c.labels('/','GET','200').inc()
    return "<p>OK - path: /</p>"

@s.labels('/random').time()
@app.route('/random')
def randomly_fail():
    if random.random() < 0.5:
        c.labels('/random','GET','503').inc()
        abort(503)
    c.labels('/random','GET','200').inc()
    return "<p>OK - path: /random</p>"

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=8080,threaded=True)