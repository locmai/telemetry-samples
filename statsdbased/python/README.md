~Client document: https://statsd.readthedocs.io/en/v3.3/~

Use StatsD with DataDog-like tags instead: https://pypi.org/project/statsd-tags/

### Start StatsD:

docker pull prom/statsd-exporter

docker run -p 9102:9102 -p 9125:9125 -p 9125:9125/udp \
        -v $PWD/statsd_mapping.yml:/tmp/statsd_mapping.yml \
        prom/statsd-exporter --statsd.mapping-config=/tmp/statsd_mapping.yml
