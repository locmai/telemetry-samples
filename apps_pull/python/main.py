from prometheus_client import make_wsgi_app, Summary
from flask import Flask
from werkzeug.middleware.dispatcher import DispatcherMiddleware

import random
import time

app = Flask(__name__)

app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
    '/metrics': make_wsgi_app()
})

REQUEST_TIME = Summary('request_processing_seconds', 'Time spent processing request')

@REQUEST_TIME.time()
@app.route("/")
def index():
    return "<p>OK!</p>"

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=8080,threaded=True)