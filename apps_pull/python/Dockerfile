FROM python:3.9.6-alpine3.13

WORKDIR /app

COPY main.py /app

COPY requirements.txt /app

RUN pip install -r requirements.txt

EXPOSE 8080

CMD python main.py