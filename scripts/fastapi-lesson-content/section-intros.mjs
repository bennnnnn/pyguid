/** One-paragraph intro shown on the first lesson of each topic. */

export const SECTION_INTROS = {
  "introduction-to-fastapi":
    "Start here for the big picture: what FastAPI is, how it compares to Flask and Django, and where it fits in a real stack (ASGI, OpenAPI, JSON APIs).",
  "environment-setup":
    "Before writing routes, set up Python, a virtual environment, FastAPI, and Uvicorn—the same foundation you will use for every project in this track.",
  "your-first-api":
    "Build your first working API: create the app object, define routes, return JSON, and test everything in the browser at `/docs`.",
  "http-methods":
    "HTTP methods are the verbs of your API. Learn when to use GET, POST, PUT, PATCH, DELETE, and the less common OPTIONS and HEAD.",
  "route-parameters":
    "URLs carry data through path segments and query strings. FastAPI validates types automatically so bad input becomes a clear 422 response.",
  "request-body":
    "POST and PUT requests usually send JSON bodies. FastAPI reads and validates them with Pydantic models before your function runs.",
  "pydantic-basics":
    "Pydantic is the data layer behind FastAPI validation. Master models, types, defaults, and nesting—these patterns appear in almost every endpoint.",
  "response-models":
    "Control what leaves your API: response schemas, hiding passwords, status codes, and examples that show up in OpenAPI docs.",
  "status-codes":
    "Status codes tell clients what happened (success, redirect, client error, server error). Use them consistently for predictable APIs.",
  "dependency-injection":
    "Dependencies share database sessions, auth checks, and settings across routes without copy-pasting the same code in every handler.",
  "validation-error-handling":
    "When input is wrong, return helpful errors. Learn validation responses, HTTPException, and global handlers for production APIs.",
  "request-validation-advanced":
    "Go beyond basic types: regex, lengths, emails, UUIDs, and custom validators for stricter contracts with clients.",
  "path-operation-configuration":
    "Polish your OpenAPI docs with tags, summaries, descriptions, and deprecation flags—small metadata that helps large teams.",
  "automatic-documentation":
    "FastAPI generates Swagger UI and ReDoc for free. Learn how `/docs` works and how to customize or disable documentation.",
  "async-programming":
    "Async routes help when your API waits on databases, HTTP calls, or files. Learn when `async def` helps—and when sync is fine.",
  "file-uploads":
    "Accept files from clients: single uploads, multiple files, validation, saving to disk, and streaming large binaries.",
  "form-data":
    "HTML forms send `application/x-www-form-urlencoded` or `multipart` data—not JSON. FastAPI handles both with `Form()` and `File()`.",
  "headers-cookies":
    "Read request headers, set response headers, and work with cookies for sessions, tokens, and browser behavior.",
  "middleware":
    "Middleware wraps every request: logging, timing, security headers, and CORS run here before your route handler executes.",
  "cors":
    "Browsers block cross-origin requests unless your API explicitly allows them. Configure CORS before connecting a React or Vue frontend.",
  "static-files":
    "Serve CSS, JavaScript, and images from your FastAPI app when you need a simple admin page or landing site alongside JSON routes.",
  "templates":
    "Return HTML with Jinja2 templates when you need server-rendered pages instead of a separate frontend framework.",
  "database-basics":
    "Most APIs persist data in a database. Compare SQL vs NoSQL and learn how environment variables keep secrets out of code.",
  "sqlalchemy":
    "SQLAlchemy is the standard Python ORM. Define models, sessions, relationships, and CRUD—the core of a data-backed API.",
  "sqlmodel":
    "SQLModel merges Pydantic and SQLAlchemy so one class can validate API input and map to database tables.",
  "alembic-migrations":
    "Schema changes need migrations. Alembic versions your database so deploys do not break production data.",
  "crud-api-development":
    "Put it together: create, read, update, delete endpoints with pagination, filtering, and search patterns clients expect.",
  "authentication":
    "Protect your API with passwords, JWT access tokens, refresh tokens, and OAuth2-style login flows.",
  "authorization":
    "Authentication proves who someone is; authorization decides what they can do—roles, permissions, and protected admin routes.",
  "security":
    "HTTPS, hashing, security headers, and common attack patterns (SQL injection, XSS, CSRF) every API developer should know.",
  "background-tasks":
    "Return a response immediately while email, notifications, or cleanup run in the background—without blocking the client.",
  "websockets":
    "WebSockets enable real-time chat, live dashboards, and push updates that HTTP polling cannot match efficiently.",
  "api-versioning":
    "Ship `/v1` and `/v2` without breaking mobile apps that still call older URLs—strategies for backward compatibility.",
  "testing":
    "Automated tests with pytest and FastAPI's TestClient catch regressions before users do.",
  "logging":
    "Structured logs and request tracing make production debugging possible when something fails at 2 a.m.",
  "configuration-management":
    "Load settings from environment variables and `.env` files so dev, staging, and production differ without code changes.",
  "project-architecture":
    "Split growing apps into routers, services, and repositories so teams can work on features without one giant `main.py`.",
  "routers":
    "`APIRouter` groups related routes under prefixes like `/users` and keeps OpenAPI tags organized.",
  "pagination-filtering":
    "List endpoints need limits, offsets or cursors, sorting, and filters—patterns that keep responses fast and usable.",
  "rate-limiting":
    "Throttle abusive clients before they overwhelm your database or bankrupt your cloud bill.",
  "caching":
    "Redis and response caching cut latency and database load for read-heavy endpoints.",
  "task-queues":
    "Long jobs belong in Celery or Redis workers—not inside HTTP request handlers that time out.",
  "deployment":
    "Production means multiple workers, reverse proxies, and configuration—not `uvicorn --reload` on your laptop.",
  "docker":
    "Package your API and dependencies into containers so every environment runs the same stack.",
  "ci-cd":
    "GitHub Actions (or similar) runs tests on every push and deploys when main is green.",
  "monitoring-observability":
    "Health checks, metrics, Prometheus, Grafana, and error tracking tell you when the API is sick before users report it.",
  "performance-optimization":
    "Profile async code, queries, and response sizes when latency matters at scale.",
  "microservices":
    "Split monoliths into services with clear boundaries, gateways, and communication patterns.",
  "graphql-with-fastapi":
    "Optional: expose GraphQL with Strawberry when clients need flexible queries instead of fixed REST shapes.",
  "advanced-fastapi":
    "Lifespan hooks, streaming, dependency overrides, and deep OpenAPI customization for mature production apps.",
};
