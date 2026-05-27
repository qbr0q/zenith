# ===== ЭТАП 1: Сборка зависимостей =====
FROM python:3.12-slim AS builder

WORKDIR /app

COPY pyproject.toml poetry.lock* ./

RUN pip install --no-cache-dir poetry \
    && poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --no-root --only main,backend \
    && rm -rf /root/.cache/pypoetry \
    && pip uninstall -y poetry

# ===== ЭТАП 2: Финальный образ =====
FROM python:3.12-slim

WORKDIR /app

COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]