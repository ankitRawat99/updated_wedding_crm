# syntax=docker/dockerfile:1



ARG PYTHON_VERSION=3.11.9
FROM python:${PYTHON_VERSION}-slim as base


ENV PYTHONDONTWRITEBYTECODE=1


ENV PYTHONUNBUFFERED=1

WORKDIR /app

ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

COPY requirements.txt /app/
RUN python -m pip install --upgrade pip && python -m pip install -r requirements.txt

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

USER appuser


COPY . .

EXPOSE 7500

CMD python3 main.py
