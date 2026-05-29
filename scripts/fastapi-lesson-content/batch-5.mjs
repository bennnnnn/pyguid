/** @type {Record<string, { quickAnswer: string; description: string; body: string }>} */
export const LESSONS = {
  "caching:redis-basics": {
    quickAnswer:
      "Redis is an in-memory data store used as a cache or message broker; connect from FastAPI with a client library and store JSON-serialized values under TTL keys.",
    description:
      "Learn Redis basics for FastAPI: what Redis is, when to cache, connecting with redis-py, and storing API-friendly key-value data.",
    body: `## Why this matters

Every database hit on a hot endpoint adds latency and load. **Redis** keeps frequently read data in memory so your API can answer in milliseconds instead of running the same SQL query thousands of times per minute.

Redis is not a replacement for Postgres. It is a **fast side cache**: product lists, session tokens, rate-limit counters, and short-lived computed results.

## Connect from Python

Install a client such as \`redis\` (sync) or \`redis.asyncio\` (async). Point it at a URL from settings:

\`\`\`python
import redis.asyncio as redis

cache = redis.from_url("redis://localhost:6379/0", decode_responses=True)

async def get_cached_user(user_id: int):
    key = f"user:{user_id}"
    raw = await cache.get(key)
    if raw:
        return json.loads(raw)
    user = await db.fetch_user(user_id)
    await cache.setex(key, 300, json.dumps(user))  # TTL 5 minutes
    return user
\`\`\`

## Core commands to know

- \`GET\` / \`SET\` / \`SETEX\` — read and write strings with optional expiry
- \`DEL\` — invalidate after updates
- \`INCR\` — atomic counters for rate limits

Use **TTL** (time to live) on cache keys so stale data expires automatically. When you update a row in the database, delete or overwrite the matching cache key.

<Callout variant="tip" title="Production tip">
Run Redis as a separate service (Docker, managed cloud). Never commit connection URLs; load them from environment variables.
</Callout>

## Recap

Redis gives you sub-millisecond reads for cached JSON. Use namespaced keys, TTLs, and invalidation on writes. Pair it with FastAPI via an async client when your routes are async.`,
  },

  "caching:api-caching": {
    quickAnswer:
      "Cache API responses by keying on route plus query or user id, returning stored JSON when valid, and skipping or bypassing the cache on writes and auth-sensitive data.",
    description:
      "FastAPI API caching patterns: cache keys, HTTP cache headers, dependency-based caching, and when not to cache.",
    body: `## Why this matters

Some endpoints are **read-heavy and expensive**: aggregations, third-party API calls, or multi-table joins. Caching the **serialized response** means the next identical request skips that work entirely.

## Cache key design

A good key uniquely identifies **what** was requested:

\`\`\`python
def catalog_cache_key(category: str, page: int) -> str:
    return f"catalog:{category}:p{page}"
\`\`\`

Include user id or tenant id when the response is not public. Never cache personalized data under a shared key.

## Pattern: check cache in a dependency

\`\`\`python
from fastapi import Depends

async def cached_catalog(category: str, page: int = 1):
    key = catalog_cache_key(category, page)
    hit = await cache.get(key)
    if hit:
        return json.loads(hit)
    data = await load_catalog(category, page)
    await cache.setex(key, 60, json.dumps(data))
    return data

@app.get("/catalog")
async def catalog(items: list = Depends(cached_catalog)):
    return items
\`\`\`

## HTTP-level caching

For **public, stable** GET responses, you can also set \`Cache-Control\` so browsers and CDNs cache safely. Private or authenticated JSON usually should use \`Cache-Control: private, no-store\` unless you control every layer.

## When not to cache

Skip caching for POST/PUT/PATCH/DELETE, one-time tokens, admin dashboards with real-time requirements, and data that must be legally fresh.

## Recap

API caching keys on request identity, stores JSON in Redis (or similar), and invalidates on updates. Combine application cache with HTTP headers only when responses are truly public.`,
  },

  "caching:performance-optimization": {
    quickAnswer:
      "Caching improves API performance by reducing duplicate work; measure hit rates, set sensible TTLs, and cache at the right layer—query results, objects, or full responses.",
    description:
      "Optimize FastAPI performance with caching strategies: layers, stampede protection, warming, and measuring cache effectiveness.",
    body: `## Why this matters

Caching is a **tradeoff**: speed versus freshness. The goal is not to cache everything—it is to cache **what hurts** when repeated and **what stays valid** long enough to matter.

## Layers of cache

1. **ORM / query cache** — same SQL result for identical filters
2. **Object cache** — one user or product record
3. **Response cache** — full JSON payload for a route

Start with the smallest layer that removes the most cost. Caching entire responses is simple but harder to invalidate precisely.

## Avoid cache stampedes

When a popular key expires, many workers may recompute at once. Mitigations:

- **Jitter** TTLs so keys do not all expire together
- **Single-flight**: only one worker rebuilds; others wait or serve stale briefly
- **Stale-while-revalidate**: return old data while refreshing in the background

## Measure what works

Track **hit rate**, **latency p95**, and **database query count** before and after. A cache with 5% hits and complex invalidation may not be worth the operational cost.

\`\`\`python
# Simple hit logging in development
if await cache.get(key):
    metrics.inc("cache_hit")
else:
    metrics.inc("cache_miss")
\`\`\`

## Recap

Pick the cache layer that matches your data lifecycle. Protect hot keys from stampedes, tune TTLs with real traffic, and validate improvements with metrics—not assumptions.`,
  },

  "task-queues:celery": {
    quickAnswer:
      "Celery is a distributed task queue for Python: define tasks with @app.task, enqueue work from FastAPI, and run workers in separate processes that execute jobs asynchronously.",
    description:
      "Use Celery with FastAPI to offload long jobs: task definitions, brokers, workers, and calling tasks from route handlers.",
    body: `## Why this matters

FastAPI should **respond quickly**. Sending email, generating PDFs, or processing uploads can take seconds. **Celery** moves that work to background **workers** so HTTP clients get an immediate acknowledgment.

## Architecture

- **Broker** (Redis or RabbitMQ) — holds queued messages
- **Worker** — Python process running \`celery worker\`
- **Result backend** (optional) — stores task outcomes

\`\`\`python
# tasks.py
from celery import Celery

celery_app = Celery("api", broker="redis://localhost:6379/1")

@celery_app.task
def send_welcome_email(user_id: int):
    user = load_user(user_id)
    mailer.send(user.email, "Welcome!")
\`\`\`

From FastAPI:

\`\`\`python
@app.post("/signup")
def signup(payload: SignupIn):
    user = create_user(payload)
    send_welcome_email.delay(user.id)
    return {"id": user.id}
\`\`\`

## Retries and reliability

Configure automatic retries for transient failures, set **time limits**, and make tasks **idempotent** (safe if run twice). Pass ids, not huge ORM objects, in task arguments.

## Recap

Celery decouples slow work from request threads. Run workers separately, use a durable broker, and design tasks to be small, idempotent, and observable.`,
  },

  "task-queues:redis-queues": {
    quickAnswer:
      "Redis queues store job payloads in lists or streams; producers LPUSH from FastAPI and consumers BRPOP in worker scripts, often with simpler setup than full Celery.",
    description:
      "Build lightweight background jobs with Redis lists or RQ: enqueue from FastAPI and process jobs in dedicated workers.",
    body: `## Why this matters

Not every project needs Celery's full feature set. **Redis as a queue** is enough for many apps: push a JSON job, pop it in a worker loop, done.

## List-based queue pattern

\`\`\`python
import json
import redis

r = redis.Redis.from_url("redis://localhost:6379/2")

def enqueue_job(name: str, payload: dict):
    r.lpush("jobs", json.dumps({"name": name, "payload": payload}))
\`\`\`

Worker:

\`\`\`python
while True:
    _, raw = r.brpop("jobs", timeout=5)
    job = json.loads(raw)
    handle(job["name"], job["payload"])
\`\`\`

## RQ (Redis Queue)

**RQ** wraps this pattern with Python decorators and a \`rq worker\` CLI—less boilerplate than raw lists, lighter than Celery.

\`\`\`python
from rq import Queue
from redis import Redis

q = Queue(connection=Redis())
q.enqueue(process_image, file_id)
\`\`\`

## Choosing Redis queues vs Celery

| Need | Redis / RQ | Celery |
|------|------------|--------|
| Simple jobs | Strong fit | Heavier |
| Complex workflows, chords | Limited | Strong fit |
| Mature monitoring | Add your own | Ecosystem tools |

## Recap

Redis queues are fast to adopt for fire-and-forget jobs. Use lists or RQ for simplicity; graduate to Celery when schedules, routing, and advanced workflows demand it.`,
  },

  "task-queues:background-workers": {
    quickAnswer:
      "Background workers are separate processes (or containers) that consume queued jobs; FastAPI enqueues work and returns while workers handle CPU- or IO-heavy tasks safely.",
    description:
      "Design background workers for FastAPI: process model, scaling, failure handling, and keeping HTTP handlers thin.",
    body: `## Why this matters

A **background worker** is not part of the Uvicorn process. It scales independently, restarts without dropping web traffic, and can run different resource limits (more memory for PDF rendering, fewer web replicas).

## Separation of concerns

| Layer | Responsibility |
|-------|----------------|
| FastAPI | Validate input, auth, enqueue job, return 202 |
| Worker | Business logic, retries, external APIs |
| Broker | Durable queue between them |

\`\`\`python
@app.post("/reports", status_code=202)
async def request_report(report_in: ReportIn, user=Depends(get_current_user)):
    job_id = str(uuid4())
    await queue.enqueue("build_report", {"job_id": job_id, "user_id": user.id})
    return {"job_id": job_id, "status": "queued"}
\`\`\`

Clients poll \`GET /reports/{job_id}\` or receive a webhook when the worker finishes.

## Scaling and safety

- Run **multiple workers** for throughput; ensure tasks are idempotent
- Use **visibility timeout** or acknowledgments so crashed workers do not lose jobs silently
- Cap concurrency per worker to protect the database

## Health checks

Workers should expose logs and metrics. The API's \`/health\` endpoint checks the web app; also monitor queue depth and worker heartbeats.

## Recap

Treat workers as first-class deployables. FastAPI enqueues; workers execute. Design jobs with ids, status endpoints, and clear failure paths.`,
  },

  "deployment:running-in-production": {
    quickAnswer:
      "Run FastAPI in production with ASGI settings for multiple workers, environment-based config, structured logging, and a process manager behind a reverse proxy—not the dev server with --reload.",
    description:
      "Production FastAPI checklist: ASGI servers, settings, logging, secrets, and differences from local development.",
    body: `## Why this matters

\`uvicorn main:app --reload\` is for development. Production needs **stability**, **concurrency**, and **safe defaults**: no auto-reload, no debug tracebacks to clients, and configuration from the environment.

## Production ASGI stack

- **Uvicorn** alone can work for small deployments
- **Gunicorn + Uvicorn workers** is a common pattern on Linux
- Container platforms often run Uvicorn directly with multiple workers

\`\`\`bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
\`\`\`

Workers are separate processes; size \`workers\` to CPU cores and test under load.

## Configuration

Load secrets and URLs from environment variables or a settings class (\`pydantic-settings\`). Never hardcode database passwords in source control.

\`\`\`python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    debug: bool = False

    model_config = {"env_file": ".env"}
\`\`\`

## Operational basics

- Disable OpenAPI docs on public internet if not needed (\`docs_url=None\`)
- Use **HTTPS** at the proxy
- Log request ids and errors centrally
- Run database migrations as a deploy step, not inside random requests

## Recap

Production FastAPI means multiple workers, env-driven config, no dev-only flags, and deployment automation. Treat the app as one service in a larger platform (proxy, DB, cache, workers).`,
  },

  "deployment:gunicorn-uvicorn": {
    quickAnswer:
      "Gunicorn manages multiple Uvicorn worker processes on Linux, giving FastAPI production-grade process supervision and graceful restarts behind a reverse proxy.",
    description:
      "Deploy FastAPI with Gunicorn and Uvicorn workers: command lines, worker count, timeouts, and when to use this stack.",
    body: `## Why this matters

**Uvicorn** implements ASGI. **Gunicorn** is a mature process manager that spawns and supervises worker processes. Together they give you multi-process concurrency and graceful reloads on Linux servers.

## Typical command

\`\`\`bash
gunicorn app.main:app \\
  -k uvicorn.workers.UvicornWorker \\
  -w 4 \\
  -b 0.0.0.0:8000 \\
  --timeout 120 \\
  --graceful-timeout 30
\`\`\`

- \`-w 4\` — four worker processes (tune to CPUs and load tests)
- \`-k uvicorn.workers.UvicornWorker\` — ASGI-capable worker class
- \`--timeout\` — kill stuck workers after long requests (adjust for slow endpoints)

## When to use Gunicorn + Uvicorn

| Scenario | Recommendation |
|----------|----------------|
| Linux VM / bare metal | Common choice |
| Docker with single Uvicorn | Often \`uvicorn --workers N\` is enough |
| Windows | Gunicorn is not supported; use Uvicorn directly |

## Graceful deploys

Send **HUP** or use Gunicorn's graceful restart so in-flight requests finish before workers recycle. Pair with a load balancer that drains connections.

## Recap

Gunicorn supervises Uvicorn workers for multi-process FastAPI on Linux. Set worker count and timeouts from real traffic, and coordinate deploys with your reverse proxy.`,
  },

  "deployment:linux-deployment": {
    quickAnswer:
      "Deploy FastAPI on Linux with a virtualenv or container, systemd to keep Uvicorn running, firewall rules, and environment files for secrets on a VPS or cloud VM.",
    description:
      "Linux deployment for FastAPI: systemd units, users and permissions, firewalls, and updating releases safely.",
    body: `## Why this matters

Most self-hosted APIs land on a **Linux VM**. Understanding users, systemd, and ports prevents "it works on my laptop" surprises when the server reboots at 3 a.m.

## Layout on the server

\`\`\`text
/opt/myapi/
  .venv/
  app/
  .env          # not in git — root-readable only
\`\`\`

Create a dedicated **system user** (\`myapi\`) that owns the app directory. Do not run the API as root.

## systemd service example

\`\`\`ini
[Unit]
Description=FastAPI (myapi)
After=network.target

[Service]
User=myapi
WorkingDirectory=/opt/myapi
EnvironmentFile=/opt/myapi/.env
ExecStart=/opt/myapi/.venv/bin/gunicorn app.main:app -k uvicorn.workers.UvicornWorker -w 4 -b 127.0.0.1:8000
Restart=always

[Install]
WantedBy=multi-user.target
\`\`\`

Bind to **127.0.0.1** if Nginx terminates TLS on the same machine. Open only ports 80/443 publicly.

## Updates

Pull new code, install dependencies, run migrations, then \`systemctl restart myapi\`. Automate with a script or CI/CD to reduce human error.

## Recap

Linux deployment combines a non-root user, systemd for restarts, local binding behind a proxy, and scripted releases. Security and repeatability matter as much as the Python code.`,
  },

  "deployment:reverse-proxy": {
    quickAnswer:
      "A reverse proxy sits in front of FastAPI, terminates TLS, routes hostnames to apps, and adds timeouts, compression, and rate limits without changing your Python code.",
    description:
      "Reverse proxies for FastAPI: TLS termination, routing, headers, WebSockets, and why Uvicorn should not face the public internet alone.",
    body: `## Why this matters

Clients should not connect directly to Uvicorn on port 8000 in production. A **reverse proxy** (Nginx, Caddy, Traefik) handles TLS certificates, HTTP/2, static files, and connection limits—work the ASGI server should not duplicate.

## Request flow

\`\`\`text
Client --HTTPS--> Reverse proxy --HTTP--> Uvicorn (FastAPI)
\`\`\`

The proxy forwards headers such as \`X-Forwarded-For\` and \`X-Forwarded-Proto\`. FastAPI/Starlette can trust these when configured so redirects and cookies use the correct scheme.

## Benefits beyond TLS

- **Load balancing** across multiple app instances
- **Request size limits** and slow-client protection
- **Caching** for static assets
- **WebSocket** upgrade handling (proxy must support it)

## FastAPI behind a proxy

Keep app binding on an internal interface. Health checks can hit the proxy or the app directly from the private network.

<Callout variant="warning" title="Trust forwarded headers carefully">
Only honor \`X-Forwarded-*\` from your proxy's IP range. Misconfigured trust enables host-header attacks.
</Callout>

## Recap

Put a reverse proxy in front of FastAPI for TLS, routing, and hardening. Run Uvicorn on localhost or a private network and let the proxy speak to the internet.`,
  },

  "deployment:nginx": {
    quickAnswer:
      "Nginx proxies HTTP to Uvicorn with proxy_pass, sets X-Forwarded headers, can serve static files, and terminates SSL with certificates from Let's Encrypt or your provider.",
    description:
      "Configure Nginx as a reverse proxy for FastAPI: upstream blocks, WebSockets, SSL, and common location blocks.",
    body: `## Why this matters

**Nginx** is the most common front door for Python APIs. A small config file connects public HTTPS to your internal Uvicorn workers.

## Minimal upstream config

\`\`\`nginx
upstream fastapi {
    server 127.0.0.1:8000;
}

server {
    listen 443 ssl;
    server_name api.example.com;

    location / {
        proxy_pass http://fastapi;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
\`\`\`

## WebSockets

FastAPI WebSocket routes need HTTP/1.1 upgrade headers:

\`\`\`nginx
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
\`\`\`

## Static files

Serve \`/static\` directly from disk in Nginx when possible—less load on Python and better caching headers.

## SSL

Use **certbot** or your cloud load balancer for certificates. Redirect HTTP to HTTPS at the server block level.

## Recap

Nginx terminates TLS and forwards to Uvicorn with the right headers. Add WebSocket headers when needed and offload static assets at the edge.`,
  },

  "deployment:docker-deployment": {
    quickAnswer:
      "Docker deployment packages FastAPI with a Dockerfile, runs Uvicorn as the container CMD, injects config via environment variables, and orchestrates updates through registries and compose or Kubernetes.",
    description:
      "Deploy FastAPI with Docker: images, multi-stage builds, env config, and production container practices.",
    body: `## Why this matters

**Docker** ships your API with exact Python dependencies. The same image runs on a laptop, CI server, and cloud—reducing "works on my machine" drift.

## Dockerfile sketch

\`\`\`dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app
ENV PYTHONUNBUFFERED=1
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

Pass \`DATABASE_URL\` and secrets at **runtime**, not build time.

## Production practices

- Use **multi-stage builds** to keep images small
- Run as a **non-root** user inside the container
- One container role per service (API vs worker vs Redis)
- Health checks: \`GET /health\` in orchestrator config

## Deploy flow

Build → push to registry → pull on server → rolling restart. Pair with Compose for small stacks or Kubernetes for larger ones.

## Recap

Docker deployment standardizes how FastAPI runs everywhere. Keep images slim, config external, and processes single-purpose per container.`,
  },

  "docker:docker-basics": {
    quickAnswer:
      "Docker builds images from Dockerfiles, runs isolated containers from those images, and uses docker compose to wire multiple services with ports, volumes, and environment variables.",
    description:
      "Docker basics for FastAPI developers: images, containers, Dockerfile, volumes, and essential CLI commands.",
    body: `## Why this matters

Before dockerizing FastAPI, you need the vocabulary: **image** (blueprint), **container** (running instance), **volume** (persistent data), **network** (how containers talk).

## Core commands

\`\`\`bash
docker build -t myapi .
docker run -p 8000:8000 --env-file .env myapi
docker ps
docker logs <container_id>
\`\`\`

\`-p 8000:8000\` maps host port 8000 to the container's port 8000.

## Dockerfile building blocks

- \`FROM\` — base image (e.g. \`python:3.12-slim\`)
- \`COPY\` / \`WORKDIR\` — application files
- \`RUN pip install\` — dependencies baked into the image
- \`CMD\` — default process (Uvicorn)

## Volumes for development

Mount source code for hot reload only in **dev** compose files. Production images should contain the code they run.

## Recap

Images are immutable artifacts; containers are runtime instances. Learn build, run, logs, and env files—the foundation for Dockerizing any FastAPI project.`,
  },

  "docker:dockerizing-fastapi": {
    quickAnswer:
      "Dockerize FastAPI with a slim Python image, installed requirements, copied app package, Uvicorn as CMD, and runtime environment variables for database and secret settings.",
    description:
      "Step-by-step Dockerize FastAPI: Dockerfile, .dockerignore, local build, and connecting to Postgres or Redis in compose.",
    body: `## Why this matters

A proper **FastAPI Dockerfile** keeps builds fast, images small, and secrets out of layers. You get reproducible deploys for every environment.

## Example Dockerfile

\`\`\`dockerfile
FROM python:3.12-slim

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

Add a **.dockerignore** excluding \`.venv\`, \`__pycache__\`, and \`.git\`.

## Local test

\`\`\`bash
docker build -t fastapi-app .
docker run --rm -p 8000:8000 --env-file .env fastapi-app
\`\`\`

Open \`http://localhost:8000/docs\` to verify.

## Database URL

Use service names on the Docker network: \`postgresql://user:pass@db:5432/app\`. \`localhost\` inside the container refers to the container itself, not your laptop.

## Recap

Dockerizing FastAPI means slim base image, pinned requirements, Uvicorn CMD, and env-based config. Test the image locally before pushing to production infrastructure.`,
  },

  "docker:docker-compose": {
    quickAnswer:
      "Docker Compose defines multi-service stacks in compose.yaml—API, database, Redis—with networks, volumes, and env files so one command starts the whole dev environment.",
    description:
      "Docker Compose for FastAPI: compose.yaml structure, depends_on, env files, and dev vs prod overrides.",
    body: `## Why this matters

Real APIs need **Postgres, Redis, and workers**. Compose declares how services connect so \`docker compose up\` boots the entire stack consistently for every developer.

## Example compose.yaml

\`\`\`yaml
services:
  api:
    build: .
    ports:
      - "8000:8000"
    env_file: .env
    depends_on:
      - db
      - redis
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: dev
    volumes:
      - pgdata:/var/lib/postgresql/data
  redis:
    image: redis:7-alpine

volumes:
  pgdata:
\`\`\`

## Networking

Services resolve each other by **service name** (\`db\`, \`redis\`). Set \`DATABASE_URL=postgresql://...@db:5432/...\` in \`.env\`.

## Overrides

Use \`compose.override.yaml\` for dev-only settings (bind mounts, \`--reload\`). Keep production compose minimal and pull images from a registry.

## Recap

Compose orchestrates FastAPI with its dependencies. Name services clearly, persist database data with volumes, and separate dev convenience from production compose files.`,
  },

  "docker:multi-container-apps": {
    quickAnswer:
      "Multi-container FastAPI apps split the API, database, cache, and workers into separate containers on one Docker network, scaling and updating each service independently.",
    description:
      "Design multi-container FastAPI applications: service boundaries, networks, scaling workers, and production topology.",
    body: `## Why this matters

Monoliths in one container are fine for learning. Production **multi-container** designs isolate failure domains: restart a worker without touching the database container.

## Typical topology

\`\`\`text
[Client] -> [Nginx] -> [api x N]
                         -> [db]
                         -> [redis]
                         -> [celery worker x M]
\`\`\`

Each box is a container (or pod). Scale **api** replicas for HTTP load; scale **workers** for queue depth.

## Communication rules

- API talks to \`db:5432\` and \`redis:6379\` on the internal network
- Do not expose Redis or Postgres ports publicly in production compose
- Pass the same \`.env\` keys to API and workers so they share config

## Stateful vs stateless

API and workers are **stateless**—replace anytime. Postgres uses a **named volume**. Back up volumes or use managed databases in cloud deployments.

## Recap

Split FastAPI, data stores, and workers into focused containers. Use private networks, scale replicas per role, and keep state in databases—not in app memory.`,
  },

  "ci-cd:github-actions": {
    quickAnswer:
      "GitHub Actions runs CI/CD workflows on push and pull_request: checkout code, install Python, run tests and linters, build Docker images, and deploy from YAML in .github/workflows/.",
    description:
      "GitHub Actions for FastAPI projects: workflow triggers, Python setup, caching dependencies, and deployment jobs.",
    body: `## Why this matters

Manual deploys break under pressure. **GitHub Actions** automates test and release steps every time someone opens a pull request or merges to \`main\`.

## Minimal test workflow

\`\`\`yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
          cache: pip
      - run: pip install -r requirements.txt
      - run: pytest
\`\`\`

## Common jobs

- **Lint** — ruff, mypy, or pre-commit
- **Test** — pytest with a service container for Postgres
- **Build** — \`docker build\` and push to GHCR or ECR
- **Deploy** — SSH, Kubernetes apply, or platform CLI (only on \`main\`)

Store secrets in **GitHub Secrets**, never in the workflow file.

## Branch protection

Require the CI job to pass before merge. Fast feedback on PRs catches regressions early.

## Recap

GitHub Actions encodes your quality gate in YAML. Start with test on every PR; add build and deploy jobs when the team is ready for continuous delivery.`,
  },

  "ci-cd:automated-testing": {
    quickAnswer:
      "Automated testing in CI runs pytest (and linters) on every change using TestClient for FastAPI routes, with optional test databases and coverage reports blocking broken merges.",
    description:
      "Automate FastAPI testing in CI: pytest, TestClient, fixtures, databases in GitHub Actions, and coverage gates.",
    body: `## Why this matters

If tests only run locally, they will be skipped. **Automated testing** in CI proves every commit still satisfies your API contract before it reaches production.

## FastAPI tests with TestClient

\`\`\`python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
\`\`\`

CI installs dev dependencies and runs \`pytest -q\`.

## Database in CI

Use a **service container** in GitHub Actions:

\`\`\`yaml
services:
  postgres:
    image: postgres:16
    env:
      POSTGRES_PASSWORD: test
\`\`\`

Point \`DATABASE_URL\` at \`localhost\` in the job env. Run migrations before tests.

## What to automate

- Happy-path CRUD and auth failures (401/403)
- Validation errors (422)
- Regression tests for fixed bugs

Optional: **coverage** threshold (\`pytest --cov\`) to prevent untested critical paths.

## Recap

Wire pytest into CI on every push. Use TestClient for speed, real Postgres when ORM behavior matters, and fail the build when tests fail—no exceptions.`,
  },

  "ci-cd:automated-deployment": {
    quickAnswer:
      "Automated deployment promotes passing builds to staging or production via CI jobs that push Docker images, run migrations, and restart services—often only from protected branches.",
    description:
      "Automate FastAPI deployment: build artifacts, environment promotion, migrations, rollbacks, and safe release practices.",
    body: `## Why this matters

**Continuous deployment** removes manual SSH steps. After CI tests pass, the same pipeline ships a known-good artifact to servers—faster releases with fewer configuration mistakes.

## Typical pipeline stages

1. **Build** — Docker image tagged with git SHA
2. **Push** — container registry
3. **Migrate** — \`alembic upgrade head\` as a one-off job
4. **Deploy** — rolling update on Kubernetes, ECS, or systemd pull

Gate production deploys on \`main\` and optional manual approval for high-risk changes.

## Immutable artifacts

Deploy **images**, not \`git pull\` on servers. The SHA in production should match the SHA that passed tests.

## Rollbacks

Keep the previous image tag. If health checks fail after deploy, automation reverts to the last known good version.

\`\`\`yaml
deploy:
  needs: test
  if: github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  steps:
  # build, push, trigger platform deploy
\`\`\`

## Recap

Automated deployment chains test → build → migrate → release. Use immutable tags, protect production branches, and plan rollbacks before you need them.`,
  },

  "monitoring-observability:health-checks": {
    quickAnswer:
      "Health check endpoints report liveness (process up) and readiness (can serve traffic); FastAPI exposes /health that verifies database and dependency connectivity for load balancers.",
    description:
      "FastAPI health checks: liveness vs readiness, dependency probes, and integration with orchestrators and load balancers.",
    body: `## Why this matters

Load balancers and Kubernetes need a simple **HTTP signal**: is this instance safe to receive traffic? Without health checks, broken pods stay in rotation and users see errors.

## Liveness vs readiness

| Endpoint | Question |
|----------|----------|
| **Liveness** | Is the process running? |
| **Readiness** | Can we handle requests (DB up)? |

\`\`\`python
@app.get("/health/live")
def live():
    return {"status": "ok"}

@app.get("/health/ready")
async def ready(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ready"}
\`\`\`

Return **503** on readiness failure so orchestrators stop sending traffic.

## What to check

- Database connection
- Redis / message broker ping
- Critical feature flags or disk space (sparingly)

Keep checks **fast**—sub-second timeouts.

## Recap

Expose separate liveness and readiness routes. Fail readiness when dependencies are down so platforms drain bad instances automatically.`,
  },

  "monitoring-observability:metrics": {
    quickAnswer:
      "Metrics are numeric time-series—request counts, latency histograms, error rates—exported from FastAPI via middleware or libraries and scraped by systems like Prometheus.",
    description:
      "Application metrics for FastAPI: RED method, counters, histograms, and instrumenting routes and dependencies.",
    body: `## Why this matters

Logs tell you **what happened once**; **metrics** show trends: error rate spiking, p95 latency doubling after a deploy. You cannot fix what you cannot measure.

## RED metrics (requests)

- **Rate** — requests per second
- **Errors** — 5xx and important 4xx
- **Duration** — latency distribution

\`\`\`python
from prometheus_client import Counter, Histogram

REQUESTS = Counter("http_requests_total", "Total HTTP requests", ["method", "path", "status"])
LATENCY = Histogram("http_request_duration_seconds", "Request latency")

@app.middleware("http")
async def metrics_middleware(request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    LATENCY.observe(time.perf_counter() - start)
    REQUESTS.labels(request.method, request.url.path, response.status_code).inc()
    return response
\`\`\`

Avoid unbounded **path** labels—cardinality explodes. Group dynamic ids as \`/users/{id}\`.

## Business metrics

Track queue depth, emails sent, or signups per hour alongside HTTP metrics for product insight.

## Recap

Instrument FastAPI with counters and histograms for traffic and latency. Control label cardinality and connect metrics to dashboards and alerts.`,
  },

  "monitoring-observability:prometheus": {
    quickAnswer:
      "Prometheus scrapes metrics HTTP endpoints on a schedule, stores time-series data, and powers alerts; FastAPI apps expose /metrics with prometheus_client or starlette-exporter.",
    description:
      "Prometheus with FastAPI: exposition format, scrape config, service discovery, and alerting basics.",
    body: `## Why this matters

**Prometheus** is the de facto open-source metrics backend. It **pulls** metrics from your app on an interval—no agent required inside FastAPI beyond an endpoint.

## Expose /metrics

\`\`\`python
from prometheus_client import make_asgi_app

metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)
\`\`\`

Protect \`/metrics\` on public networks (firewall or auth)—it can leak operational detail.

## Scrape configuration

\`\`\`yaml
scrape_configs:
  - job_name: fastapi
    static_configs:
      - targets: ["api:8000"]
\`\`\`

In Kubernetes, use **pod annotations** or ServiceMonitor for dynamic targets.

## Alerting

Prometheus **Alertmanager** routes firing rules (e.g. error rate > 5% for 5m) to Slack or PagerDuty. Start with a few high-signal alerts to avoid noise.

## Recap

Prometheus scrapes FastAPI's /metrics endpoint. Define scrape targets per environment, limit exposure, and alert on symptoms users feel (errors, latency).`,
  },

  "monitoring-observability:grafana": {
    quickAnswer:
      "Grafana visualizes Prometheus (and other) metrics with dashboards and panels; connect a data source, build charts for latency and errors, and share views with your team.",
    description:
      "Grafana dashboards for FastAPI: data sources, panels, RED dashboards, and on-call friendly visualizations.",
    body: `## Why this matters

Raw Prometheus queries are powerful but unfriendly during incidents. **Grafana** turns metrics into **dashboards** everyone can read at a glance.

## Setup flow

1. Run Grafana (Docker or managed)
2. Add **Prometheus** as a data source (\`http://prometheus:9090\`)
3. Import or build a dashboard for your API

## Useful panels

- **Request rate** — \`sum(rate(http_requests_total[5m]))\`
- **Error percentage** — 5xx / total
- **Latency percentiles** — histogram \`histogram_quantile(0.95, ...)\`
- **Saturation** — CPU, memory, DB connections

Group panels by **deploy version** or environment using template variables.

## Annotations

Mark deploy times on graphs to correlate latency spikes with releases—a habit that saves hours of debugging.

## Recap

Grafana is the visualization layer on top of Prometheus. Build RED-focused dashboards, annotate deploys, and keep on-call dashboards simple and fast to load.`,
  },

  "monitoring-observability:error-tracking": {
    quickAnswer:
      "Error tracking services (Sentry and similar) capture unhandled exceptions from FastAPI with stack traces, request context, and release tags so you fix production bugs with full detail.",
    description:
      "Error tracking for FastAPI: Sentry integration, exception handlers, breadcrumbs, and release tracking.",
    body: `## Why this matters

Users rarely send stack traces. **Error tracking** groups identical exceptions, shows how many users hit them, and links to the exact line in your release.

## Sentry with FastAPI

\`\`\`python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=os.environ["SENTRY_DSN"],
    integrations=[FastApiIntegration()],
    traces_sample_rate=0.1,
    environment="production",
    release=os.environ.get("GIT_SHA"),
)
\`\`\`

Unhandled exceptions are reported automatically. Use \`sentry_sdk.capture_exception()\` in custom handlers when you swallow errors.

## Context that helps

- User id (not passwords)
- Request path and method
- Tags: \`tenant_id\`, \`feature_flag\`

Scrub PII in before-send hooks to stay compliant.

## vs logs and metrics

| Tool | Best for |
|------|----------|
| Logs | Audit trail, debugging one request |
| Metrics | Trends and alerting |
| Error tracking | Stack traces and regression grouping |

## Recap

Add error tracking early in production. Tag releases, avoid leaking secrets, and triage by frequency and user impact—not every unique log line.`,
  },

  "performance-optimization:async-optimization": {
    quickAnswer:
      "Async optimization means using async def routes and await for I/O-bound work so FastAPI does not block the event loop; keep CPU-heavy code in thread pools or workers.",
    description:
      "Optimize FastAPI async code: when to use async routes, blocking pitfalls, httpx, and thread pool executors.",
    body: `## Why this matters

FastAPI on Uvicorn is **async-first**. One blocked event loop thread delays **all** concurrent requests on that worker. Async pays off when you wait on networks and databases—not when crunching numbers.

## Use async for I/O

\`\`\`python
import httpx

@app.get("/feed")
async def feed():
    async with httpx.AsyncClient() as client:
        r = await client.get("https://api.example.com/items")
    return r.json()
\`\`\`

\`await\` yields control while waiting—other requests proceed.

## Do not block the loop

Sync \`time.sleep\`, heavy pandas work, or blocking SQL drivers inside \`async def\` stall everything. Fixes:

- Use **async** database drivers (\`asyncpg\`, SQLAlchemy async)
- Offload CPU work: \`await run_in_threadpool(cpu_heavy, data)\`
- Move long jobs to **background workers**

## Sync routes are fine

Def sync endpoints run in a thread pool automatically. A plain \`def\` route with a fast sync ORM can be simpler than misused async.

## Recap

Async optimization matches async I/O end to end. Profile blocking calls, never await blocking libraries by mistake, and offload CPU and long tasks to workers.`,
  },

  "performance-optimization:database-optimization": {
    quickAnswer:
      "Database optimization for FastAPI means indexes on filtered columns, eager loading to avoid N+1 queries, connection pooling, pagination, and analyzing slow queries with EXPLAIN.",
    description:
      "FastAPI database performance: SQLAlchemy loading strategies, indexes, pooling, and query tuning.",
    body: `## Why this matters

The database is usually the **bottleneck**. Faster Python saves milliseconds; a missing index can cost seconds on every list endpoint.

## Fix N+1 queries

\`\`\`python
# Bad: one query per item in a loop
users = session.scalars(select(User)).all()
for u in users:
    _ = u.posts  # lazy load each time

# Better: joinedload
from sqlalchemy.orm import joinedload
users = session.scalars(
    select(User).options(joinedload(User.posts))
).unique().all()
\`\`\`

## Indexes and pagination

Add indexes on columns in \`WHERE\`, \`ORDER BY\`, and foreign keys. Always **paginate** large lists (\`limit\`/\`offset\` or keyset).

## Connection pooling

SQLAlchemy's pool reuses connections. Size the pool for concurrent workers × expected concurrency—not one new connection per request.

## Measure

Log slow queries in development. Run \`EXPLAIN ANALYZE\` on production-like data volumes before guessing.

## Recap

Optimize databases with indexes, eager loading, pooling, and pagination. Let metrics guide which endpoints need caching or schema changes.`,
  },

  "performance-optimization:response-compression": {
    quickAnswer:
      "Response compression (gzip or Brotli) shrinks large JSON and HTML payloads; enable it at the reverse proxy or with Starlette GZipMiddleware for bandwidth savings.",
    description:
      "Compress FastAPI responses: GZipMiddleware, proxy-level compression, and when compression helps or hurts.",
    body: `## Why this matters

JSON APIs can be **large**—especially list endpoints. **Compression** reduces bytes on the wire, improving mobile latency and lowering egress costs. Small responses may grow if compressed—know the threshold.

## GZipMiddleware in FastAPI

\`\`\`python
from starlette.middleware.gzip import GZipMiddleware

app.add_middleware(GZipMiddleware, minimum_size=500)
\`\`\`

Only responses above \`minimum_size\` bytes are compressed. Clients send \`Accept-Encoding: gzip\`.

## Proxy-level compression

Nginx and CDNs often compress more efficiently and offload CPU from Python:

\`\`\`nginx
gzip on;
gzip_types application/json;
\`\`\`

Pick **one layer**—double compression is wasteful.

## Tradeoffs

- CPU cost on server and client
- Already-compressed formats (JPEG, gzip files) benefit little
- **Brotli** beats gzip on text but needs broader client support

## Recap

Enable gzip for large JSON at the proxy or via GZipMiddleware. Set a minimum size, avoid compressing tiny responses twice, and measure real-world payload sizes.`,
  },

  "performance-optimization:profiling": {
    quickAnswer:
      "Profiling finds where FastAPI spends time—cProfile for CPU hotspots, py-spy for production sampling, and APM tools for request-level traces across Python and SQL.",
    description:
      "Profile FastAPI applications: cProfile, py-spy, logging slow requests, and interpreting results.",
    body: `## Why this matters

Guessing bottlenecks wastes effort. **Profiling** shows which functions and queries consume the most time under realistic load.

## Development: cProfile

\`\`\`bash
python -m cProfile -o out.prof -m uvicorn app.main:app
python -m pstats out.prof
\`\`\`

Sort by **cumulative** time to see call chains. Focus on your code, not only library internals.

## Production-safe: py-spy

**py-spy** samples a running process without code changes—useful when you cannot restart with debug flags.

## Request-level timing

Middleware logging slow requests:

\`\`\`python
@app.middleware("http")
async def log_slow(request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    ms = (time.perf_counter() - start) * 1000
    if ms > 500:
        logger.warning("slow_request path=%s ms=%.0f", request.url.path, ms)
    return response
\`\`\`

Pair with DB query logging for end-to-end traces.

## Load test while profiling

Profile under **locust** or k6 load—idle-server profiles mislead.

## Recap

Profile before optimizing. Use cProfile locally, sampling in production, and slow-request logs. Fix the top hotspots, then measure again.`,
  },

  "microservices:service-communication": {
    quickAnswer:
      "Microservices communicate over HTTP APIs or message queues; FastAPI services call each other with httpx, enforce timeouts, retries with backoff, and clear service contracts.",
    description:
      "Service communication patterns for FastAPI microservices: sync HTTP, async messaging, resilience, and API contracts.",
    body: `## Why this matters

Splitting a monolith into **services** only helps if boundaries are clear. **Communication** choices—sync REST vs async events—shape latency, failure modes, and data consistency.

## Synchronous HTTP

\`\`\`python
async with httpx.AsyncClient(timeout=5.0) as client:
    r = await client.get(f"{BILLING_URL}/accounts/{user_id}")
    r.raise_for_status()
    account = r.json()
\`\`\`

Always set **timeouts**. Retry idempotent GETs with exponential backoff; avoid blind retries on POST.

## Asynchronous messaging

Publish **events** (\`UserCreated\`) to a broker when other services only need eventual consistency. Consumers process independently—better decoupling, harder debugging.

## Contracts

Share **OpenAPI** specs or protobuf definitions. Version APIs (\`/v1/\`) so services evolve without breaking neighbors.

## Recap

FastAPI microservices talk via HTTP or queues with strict timeouts and explicit schemas. Prefer events for loose coupling; use sync calls when you need an immediate answer.`,
  },

  "microservices:api-gateways": {
    quickAnswer:
      "An API gateway is the single public entry point that routes to internal FastAPI services, handling auth, rate limits, TLS, and request routing without exposing every microservice directly.",
    description:
      "API gateways for FastAPI microservices: routing, auth termination, rate limiting, and popular gateway tools.",
    body: `## Why this matters

Clients should not know about twelve internal hostnames. An **API gateway** presents one URL, enforces cross-cutting policies, and routes \`/users\` to the users service and \`/orders\` to orders.

## Responsibilities

- **Routing** — path-based or host-based to backend services
- **Authentication** — validate JWT once at the edge
- **Rate limiting** — protect backends from abuse
- **TLS termination** — certificates in one place

\`\`\`text
Mobile app --> API Gateway --> users-service (FastAPI)
                           --> orders-service (FastAPI)
\`\`\`

## Implementations

**Kong**, **Traefik**, **AWS API Gateway**, and **Nginx** are common. Some teams embed a thin BFF (backend for frontend) in FastAPI instead of a heavy gateway for small systems.

## Avoid gateway god-objects

Keep **business logic** in services. The gateway should not become a second monolith with domain rules scattered in config plugins.

## Recap

API gateways unify public access to many FastAPI services. Use them for auth, limits, and routing—keep domain logic in the services behind the gate.`,
  },

  "microservices:distributed-systems-basics": {
    quickAnswer:
      "Distributed systems trade single-machine simplicity for independent services, partial failures, and eventual consistency—design FastAPI apps with timeouts, idempotency, and clear failure boundaries.",
    description:
      "Distributed systems basics for FastAPI developers: CAP tradeoffs, failures, sagas, and operational realities.",
    body: `## Why this matters

A **distributed system** is multiple computers pretending to be one application. Networks fail, messages duplicate, and clocks disagree. FastAPI microservices inherit these facts whether you plan for them or not.

## Partial failure

One service down should not cascade blindly. Use **circuit breakers**, **timeouts**, and **degraded responses** (cached defaults) where appropriate.

## Consistency

Strong ACID across services is expensive. Many flows use **sagas**: local transaction + event + compensating action if a downstream step fails.

Example: charge payment → if inventory fails, refund payment.

## Idempotency

Retries are inevitable. Accept **idempotency keys** on POST so duplicate deliveries do not double-charge.

## Observability is mandatory

Distributed tracing (OpenTelemetry) links a request id across HTTP calls and queue messages—essential for debugging.

## Recap

Distributed FastAPI systems fail in partial ways. Design for timeouts, idempotent writes, eventual consistency, and traces—not the happy path only.`,
  },

  "graphql-with-fastapi:graphql-basics": {
    quickAnswer:
      "GraphQL lets clients request exactly the fields they need in one query; with FastAPI you often mount a GraphQL ASGI app alongside REST routes for flexible read APIs.",
    description:
      "GraphQL basics for FastAPI developers: schema, queries, types, and when GraphQL beats REST.",
    body: `## Why this matters

**REST** returns fixed resource shapes. **GraphQL** lets the client specify nested fields in one round trip—great for mobile apps with varied screens, harder when you need simple caching everywhere.

## Core concepts

- **Schema** — types and operations the server supports
- **Query** — read data (like GET, but flexible)
- **Mutation** — write data
- **Resolver** — function that fetches each field

\`\`\`graphql
query {
  user(id: 1) {
    name
    posts { title }
  }
}
\`\`\`

One request; server resolves \`user\` then \`posts\`.

## FastAPI integration pattern

FastAPI remains your **REST and auth** surface; mount GraphQL at \`/graphql\` with a library such as Strawberry or Ariadne. Share database sessions and auth dependencies where possible.

## Tradeoffs

| GraphQL strengths | Challenges |
|-------------------|------------|
| Flexible reads | Complex caching |
| Fewer round trips | N+1 resolver queries without care |
| Strong typing | Query cost abuse (depth limits) |

## Recap

GraphQL is a schema-driven query language for flexible reads. Pair it with FastAPI as a mounted app, and plan resolver performance and query limits from day one.`,
  },

  "graphql-with-fastapi:strawberry-graphql": {
    quickAnswer:
      "Strawberry GraphQL defines schemas with Python type hints and dataclasses, integrates with FastAPI via GraphQLRouter, and generates GraphQL types from your Python models.",
    description:
      "Use Strawberry GraphQL with FastAPI: schema types, resolvers, GraphQLRouter, and context for database sessions.",
    body: `## Why this matters

**Strawberry** is a modern GraphQL library for Python that feels like FastAPI—type hints, clear errors, and first-class ASGI support.

## Define types

\`\`\`python
import strawberry

@strawberry.type
class Post:
    id: int
    title: str

@strawberry.type
class Query:
    @strawberry.field
    def post(self, id: int) -> Post | None:
        row = db.get_post(id)
        return Post(id=row.id, title=row.title) if row else None
\`\`\`

## Mount on FastAPI

\`\`\`python
from strawberry.fastapi import GraphQLRouter

schema = strawberry.Schema(query=Query)
graphql_app = GraphQLRouter(schema)

app = FastAPI()
app.include_router(graphql_app, prefix="/graphql")
\`\`\`

Visit \`/graphql\` for the GraphiQL IDE in development.

## Context for dependencies

Pass a **context** object with DB sessions per request—similar to FastAPI \`Depends\`—so resolvers do not open global connections.

## Recap

Strawberry brings typed GraphQL schemas to Python. Mount \`GraphQLRouter\` on FastAPI, resolve fields in methods, and inject database access through context.`,
  },

  "graphql-with-fastapi:queries-mutations": {
    quickAnswer:
      "GraphQL queries read data and mutations change it; in Strawberry, define both on the schema, validate inputs with types, and keep mutations thin with service-layer logic shared with REST.",
    description:
      "GraphQL queries and mutations with FastAPI: Strawberry patterns, input types, errors, and parity with REST endpoints.",
    body: `## Why this matters

**Queries** should be safe and cache-friendly. **Mutations** perform creates, updates, and deletes—often the same business rules as your REST POST/PUT handlers. Duplicating logic twice causes bugs.

## Query example

\`\`\`python
@strawberry.type
class Query:
    @strawberry.field
    def posts(self, limit: int = 10) -> list[Post]:
        return [Post(**row.__dict__) for row in db.list_posts(limit)]
\`\`\`

## Mutation example

\`\`\`python
@strawberry.input
class CreatePostInput:
    title: str

@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_post(self, data: CreatePostInput) -> Post:
        row = post_service.create(title=data.title)
        return Post(id=row.id, title=row.title)

schema = strawberry.Schema(query=Query, mutation=Mutation)
\`\`\`

## Errors and validation

Return structured GraphQL errors for domain failures. Reuse **Pydantic** models in a service layer both REST and GraphQL call.

## Performance

Batch database access with **DataLoader** patterns when resolvers fetch related objects—avoid N+1 queries on nested fields.

## Recap

Queries read, mutations write. Share service logic with REST, validate inputs with Strawberry types, and optimize nested resolvers with dataloaders.`,
  },

  "advanced-fastapi:lifespan-events": {
    quickAnswer:
      "Lifespan events in FastAPI use an async context manager on the app to run startup logic before serving and shutdown cleanup when the process exits—replacing deprecated on_event handlers.",
    description:
      "FastAPI lifespan context manager: startup/shutdown resources, database pools, and migration from on_event.",
    body: `## Why this matters

Apps need **setup** (connect pools, warm caches) and **teardown** (close connections). The modern **lifespan** API runs once per application instance—cleaner than scattered global state.

## Lifespan pattern

\`\`\`python
from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
  app.state.db = await connect_pool()
  yield
  await app.state.db.close()

app = FastAPI(lifespan=lifespan)
\`\`\`

Code before \`yield\` runs at **startup**; code after runs at **shutdown**.

## What belongs here

- Database engine / Redis clients
- Loading ML models into memory
- Scheduling background tasks (prefer dedicated workers for heavy jobs)

Access shared resources via \`request.app.state\` in routes.

## Recap

Use \`lifespan\` for startup and shutdown in one place. Yield separates the serving phase from cleanup—prefer this over deprecated \`@app.on_event\` for new projects.`,
  },

  "advanced-fastapi:startup-shutdown-events": {
    quickAnswer:
      "Startup and shutdown events (@app.on_event or lifespan) initialize and release shared resources; prefer lifespan in new FastAPI apps for clearer async setup and teardown.",
    description:
      "FastAPI startup and shutdown events: on_event vs lifespan, shared state, and resource cleanup.",
    body: `## Why this matters

Without explicit **startup**, you might open a new database connection per request. Without **shutdown**, deploys leak connections and file handles.

## Legacy on_event (still seen in older code)

\`\`\`python
@app.on_event("startup")
async def startup():
    app.state.cache = await redis.from_url(settings.redis_url)

@app.on_event("shutdown")
async def shutdown():
    await app.state.cache.aclose()
\`\`\`

FastAPI documents **lifespan** as the replacement—one function owns both sides.

## Multiple workers caution

With Gunicorn **four workers**, startup runs **four times**—once per process. Do not run one-off migrations in startup unless guarded; use a deploy job instead.

## Testing

Use \`lifespan\` context in tests (\`httpx.ASGITransport\` with \`lifespan="on"\`) so fixtures see the same \`app.state\` as production.

## Recap

Startup opens shared clients; shutdown closes them. Migrate from \`on_event\` to lifespan, and remember each worker process has its own startup cycle.`,
  },

  "advanced-fastapi:custom-response-classes": {
    quickAnswer:
      "Custom response classes in FastAPI subclass Response or use Response subclasses to control headers, media types, and body serialization beyond default JSON.",
    description:
      "FastAPI custom response classes: Response, JSONResponse, FileResponse, ORJSONResponse, and building specialized API responses.",
    body: `## Why this matters

Not every endpoint returns JSON. **Custom response classes** standardize CSV downloads, protobuf, HTML fragments, or cached JSON with special headers.

## Built-in options

- \`JSONResponse\` — default JSON with status
- \`ORJSONResponse\` — faster serialization (install orjson)
- \`FileResponse\` / \`StreamingResponse\` — files and streams
- \`HTMLResponse\`, \`PlainTextResponse\`

\`\`\`python
from fastapi.responses import ORJSONResponse

@app.get("/items", response_class=ORJSONResponse)
def list_items():
    return [{"id": 1}]
\`\`\`

## Subclassing Response

\`\`\`python
from starlette.responses import Response

class CsvResponse(Response):
    media_type = "text/csv"

    def __init__(self, content: str, **kwargs):
        super().__init__(content=content, **kwargs)
\`\`\`

Declare \`response_class\` on the route so OpenAPI documents the correct content type.

## Recap

Pick or subclass response types to match payload format and performance needs. Set \`response_class\` on routes for accurate docs and consistent headers.`,
  },

  "advanced-fastapi:streaming-responses": {
    quickAnswer:
      "StreamingResponse sends large or generated bodies in chunks—ideal for files, SSE, and slow generators—without loading the entire payload into memory first.",
    description:
      "FastAPI streaming responses: StreamingResponse, async generators, Server-Sent Events, and download patterns.",
    body: `## Why this matters

Returning a 500 MB file as one byte string can **OOM** your worker. **Streaming** reads and sends chunks incrementally—lower memory, faster time-to-first-byte.

## File streaming

\`\`\`python
from fastapi.responses import StreamingResponse

def iterfile():
    with open("report.csv", "rb") as f:
        yield from f

@app.get("/export")
def export():
    return StreamingResponse(iterfile(), media_type="text/csv")
\`\`\`

Use async generators with \`async def\` iterators for async I/O sources.

## Server-Sent Events (SSE)

\`\`\`python
async def event_stream():
    while True:
        yield f"data: {json.dumps({'ts': time.time()})}\\n\\n"
        await asyncio.sleep(1)

@app.get("/events")
async def events():
    return StreamingResponse(event_stream(), media_type="text/event-stream")
\`\`\`

Clients use \`EventSource\` in browsers for live dashboards.

## Headers

Set \`Content-Disposition\` for downloads. Disable buffering in some proxies (\`X-Accel-Buffering: no\` on Nginx) for real-time streams.

## Recap

StreamingResponse handles large files and live feeds efficiently. Use generators, match media types, and configure proxies for low-latency streams.`,
  },

  "advanced-fastapi:dependency-overrides": {
    quickAnswer:
      "app.dependency_overrides replaces Depends() callables in tests or alternate environments—swap get_db or get_current_user with fakes without changing route signatures.",
    description:
      "FastAPI dependency overrides: testing with TestClient, mocking auth and databases, and temporary override scope.",
    body: `## Why this matters

**Dependencies** keep routes thin, but tests need **controlled doubles**—a fake user, in-memory DB, or stub payment client. Overrides replace implementations without editing production code.

## Override pattern

\`\`\`python
def fake_current_user():
    return User(id=1, email="test@example.com")

app.dependency_overrides[get_current_user] = fake_current_user

client = TestClient(app)
r = client.get("/me")
assert r.json()["email"] == "test@example.com"

app.dependency_overrides.clear()
\`\`\`

Always **clear** overrides after tests to avoid leaking state between cases.

## pytest fixture

\`\`\`python
@pytest.fixture
def client():
    app.dependency_overrides[get_db] = lambda: test_session()
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
\`\`\`

## Production caution

Overrides are for **tests and local tooling**, not feature flags in production—explicit configuration is easier to audit.

## Recap

\`dependency_overrides\` maps real Depends callables to test doubles. Use in TestClient and pytest fixtures, then clear overrides when done.`,
  },

  "advanced-fastapi:advanced-openapi-customization": {
    quickAnswer:
      "Customize FastAPI OpenAPI with custom schemas, operation_id, tags, examples, multiple responses, and openapi_tags—or replace the entire openapi() generator for full control of generated docs.",
    description:
      "Advanced OpenAPI customization in FastAPI: schema extras, webhooks, custom openapi(), and production documentation policies.",
    body: `## Why this matters

Auto-generated **Swagger** is FastAPI's superpower until you need **branded docs**, hidden internal routes, or strict client SDK generation. OpenAPI customization bridges that gap.

## Route-level metadata

\`\`\`python
@app.post(
    "/items",
    tags=["catalog"],
    summary="Create an item",
    response_model=ItemOut,
    responses={409: {"description": "SKU already exists"}},
)
def create_item(item: ItemIn):
    ...
\`\`\`

Use \`openapi_extra\` for vendor extensions or additional schema fragments.

## Global tags and descriptions

\`\`\`python
app = FastAPI(
    openapi_tags=[
        {"name": "catalog", "description": "Product catalog operations"},
    ]
)
\`\`\`

## Replace openapi()

\`\`\`python
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    schema = get_openapi(title=app.title, version="1.0.0", routes=app.routes)
    # mutate schema — remove paths, add security schemes
    app.openapi_schema = schema
    return schema

app.openapi = custom_openapi
\`\`\`

Use for consistent **security schemes** (OAuth2 flows) or stripping beta endpoints from public docs.

## Production

Disable public docs (\`docs_url=None\`) while exporting OpenAPI JSON in CI for contract tests.

## Recap

Tune OpenAPI with per-route metadata, global tags, and optional custom \`openapi()\`. Keep public docs accurate and generate client SDKs from the same schema your tests validate.`,
  },
};
