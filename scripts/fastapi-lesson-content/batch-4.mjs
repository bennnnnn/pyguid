import { py, h2, h3, p, ul, callout, mdx } from "./core.mjs";

/** @type {Record<string, { quickAnswer: string; description: string; body: string }>} */
export const LESSONS = {
  "background-tasks:running-tasks-in-background": {
    quickAnswer:
      "Use FastAPI's BackgroundTasks to run work after the response is sent—ideal for emails, logging, or cleanup without blocking the client.",
    description:
      "Run slow work after responding with FastAPI BackgroundTasks—email, logging, and cleanup without blocking HTTP clients.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Clients should not wait for work that does not affect the response body. Sending a welcome email or writing an audit log can take seconds; if you do that inside the route handler, the HTTP response waits too. **Background tasks** let FastAPI finish the response first, then run your function.",
      ),
      h3("Add a background task"),
      py(`from fastapi import BackgroundTasks, FastAPI

app = FastAPI()

def write_log(message: str):
    with open("log.txt", "a") as f:
        f.write(message + "\\n")

@app.post("/users/")
def create_user(name: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(write_log, f"created {name}")
    return {"name": name, "status": "created"}`),
      p(
        "Inject `BackgroundTasks`, call `add_task` with a function and its arguments, then return immediately. FastAPI schedules the task after the response is delivered.",
      ),
      callout(
        "info",
        "Background tasks run in the same process as the request. For heavy or long-running jobs, use a task queue (Celery, RQ) instead.",
      ),
      h2("Recap"),
      ul([
        "Inject `BackgroundTasks` into the route.",
        "Call `background_tasks.add_task(fn, *args)` before returning.",
        "Use for quick follow-up work—not for CPU-heavy or multi-minute jobs.",
      ]),
    ),
  },

  "background-tasks:email-sending": {
    quickAnswer:
      "Queue email sends with BackgroundTasks so signup and password-reset endpoints return quickly while SMTP runs afterward.",
    description:
      "Send email from FastAPI without blocking responses—queue SMTP with BackgroundTasks on signup and password-reset routes.",
    body: mdx(
      h2("Why this matters"),
      p(
        "SMTP connections are slow and unreliable compared to a database insert. If you send email synchronously inside a signup route, a mail server timeout becomes a failed signup for the user. Moving email to a **background task** keeps the API fast and predictable.",
      ),
      h3("Pattern: send after create"),
      py(`from fastapi import BackgroundTasks, FastAPI

app = FastAPI()

def send_welcome_email(to: str):
  # use smtplib, SendGrid, or similar in production
    print(f"Sending welcome email to {to}")

@app.post("/register")
def register(email: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_welcome_email, email)
    return {"email": email, "message": "Account created"}`),
      p(
        "The route creates the user (or enqueues creation), schedules `send_welcome_email`, and returns `201` right away. Pass only simple arguments—IDs and email strings—not open database sessions.",
      ),
      callout(
        "warning",
        "Background tasks share the same worker. If the process restarts before the task runs, the email may never send. Critical mail should use a durable queue with retries.",
      ),
      h2("Recap"),
      ul([
        "Never block the HTTP response on SMTP.",
        "Pass email and user id into the task function.",
        "Use a real queue when delivery must be guaranteed.",
      ]),
    ),
  },

  "background-tasks:notifications": {
    quickAnswer:
      "Fire push, SMS, or in-app notifications from BackgroundTasks after the main action succeeds so users get instant API responses.",
    description:
      "Deliver push, SMS, and in-app notifications from FastAPI without slowing API responses—patterns with BackgroundTasks.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Notifications—push tokens, webhooks to Slack, SMS—are side effects. The client usually only needs confirmation that the action happened (comment saved, order placed). Delivering alerts in the background matches user expectations for snappy APIs.",
      ),
      h3("Notify after the main work"),
      py(`from fastapi import BackgroundTasks, FastAPI

app = FastAPI()

def notify_subscribers(post_id: int, author: str):
    # call FCM, APNs, or a webhook
    print(f"New post {post_id} by {author}")

@app.post("/posts/{post_id}")
def publish_post(
    post_id: int,
    author: str,
    background_tasks: BackgroundTasks,
):
    background_tasks.add_task(notify_subscribers, post_id, author)
    return {"post_id": post_id, "published": True}`),
      p(
        "Keep notification logic in a dedicated function or service module. The route stays thin: validate input, persist data, schedule notify, return JSON.",
      ),
      h3("Batching and failures"),
      p(
        "For many recipients, the background function can batch API calls or publish one message to a queue that workers fan out. Log failures inside the task; the HTTP client will not see them, so monitoring matters.",
      ),
      h2("Recap"),
      ul([
        "Treat notifications as post-response side effects.",
        "One `add_task` per logical event is enough to start.",
        "Scale with a message broker when recipient counts grow.",
      ]),
    ),
  },

  "background-tasks:scheduled-tasks-basics": {
    quickAnswer:
      "FastAPI BackgroundTasks run once after a request—they are not cron jobs; use APScheduler, Celery Beat, or an external scheduler for recurring work.",
    description:
      "BackgroundTasks vs real schedulers in FastAPI—when to use post-request tasks and when to add APScheduler or Celery Beat.",
    body: mdx(
      h2("Why this matters"),
      p(
        "**Background tasks** run once, tied to a single HTTP request. **Scheduled tasks** run on a clock—nightly reports, cache warming, subscription renewals. Confusing the two leads to missed jobs or cron logic hidden inside random endpoints.",
      ),
      h3("What BackgroundTasks can do"),
      p(
        "After `POST /import`, schedule a one-off cleanup. After `DELETE /account`, schedule anonymization. No timer is involved; the trigger is always a request.",
      ),
      h3("What needs a scheduler"),
      py(`# Celery Beat example (separate worker process)
from celery import Celery
from celery.schedules import crontab

app = Celery("tasks", broker="redis://localhost:6379/0")

@app.on_after_configure.connect
def setup_periodic(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=2, minute=0),
        cleanup_expired_tokens.s(),
    )`),
      p(
        "Options include **Celery Beat**, **APScheduler** in a dedicated process, or cloud cron hitting an internal endpoint protected by a secret. FastAPI itself does not ship a job scheduler.",
      ),
      callout(
        "info",
        "Calling an internal `POST /jobs/run` from cron is valid for small apps—protect it with an API key and keep the handler idempotent.",
      ),
      h2("Recap"),
      ul([
        "BackgroundTasks = one-shot, request-triggered.",
        "Schedulers = time-based, recurring.",
        "Pick a queue or Beat worker before production cron needs grow.",
      ]),
    ),
  },

  "websockets:real-time-communication": {
    quickAnswer:
      "WebSockets keep a persistent two-way channel between browser and server—use FastAPI's @app.websocket for live data instead of polling HTTP.",
    description:
      "WebSockets in FastAPI for real-time, two-way communication—when to use them instead of polling REST endpoints.",
    body: mdx(
      h2("Why this matters"),
      p(
        "HTTP is request–response: the client asks, the server answers, the connection closes. **WebSockets** upgrade a TCP connection so both sides can push messages anytime. Dashboards, games, and collaborative editors need that pattern; polling every second wastes bandwidth and adds lag.",
      ),
      h3("A minimal WebSocket route"),
      py(`from fastapi import FastAPI, WebSocket

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Echo: {data}")`),
      p(
        "Call `accept()` to complete the handshake, then loop on `receive_text()` (or `receive_json()`). Use `async` handlers so waiting for messages does not block other connections.",
      ),
      h3("WebSockets vs REST"),
      p(
        "REST stays best for CRUD and cacheable reads. WebSockets fit **streaming state**—live scores, typing indicators, server-pushed alerts. Many apps combine both: REST for actions, WebSocket for updates.",
      ),
      h2("Recap"),
      ul([
        "WebSocket = persistent, bidirectional channel.",
        "Use `@app.websocket` and `await websocket.accept()`.",
        "Pair with REST; do not replace your entire API with sockets.",
      ]),
    ),
  },

  "websockets:chat-applications": {
    quickAnswer:
      "Broadcast chat messages by keeping a list of connected WebSockets and sending each new message to every client in the room.",
    description:
      "Build a simple chat server in FastAPI—accept WebSocket clients, broadcast messages, and manage rooms.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Chat is the classic WebSocket tutorial: many clients, frequent small messages, low latency. FastAPI can host a room-based chat with a shared in-memory connection list (fine for learning; use Redis pub/sub at scale).",
      ),
      h3("Connection manager pattern"),
      py(`from fastapi import FastAPI, WebSocket

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        self.active: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active.append(websocket)

    async def broadcast(self, message: str):
        for connection in self.active:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/chat")
async def chat(websocket: WebSocket):
    await manager.connect(websocket)
    while True:
        text = await websocket.receive_text()
        await manager.broadcast(text)`),
      p(
        "Each new message goes to every connected socket. Add room IDs in the path (`/chat/{room_id}`) and store separate manager instances per room.",
      ),
      callout(
        "warning",
        "In-memory lists break with multiple server processes. Production chat uses Redis, NATS, or a managed realtime service.",
      ),
      h2("Recap"),
      ul([
        "Accept connections, append to a manager, broadcast on receive.",
        "Scope by room id when chats are separate.",
        "Plan a shared pub/sub layer before horizontal scaling.",
      ]),
    ),
  },

  "websockets:live-updates": {
    quickAnswer:
      "Push live dashboard or feed updates from the server over WebSockets when data changes—clients subscribe once instead of polling.",
    description:
      "Push live dashboard and feed updates over FastAPI WebSockets—subscribe once instead of polling REST.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Stock tickers, order status, and sports scores change continuously. Polling `GET /status` every second hammers your API and still feels delayed. **Server-push** over WebSockets lets clients subscribe once and receive updates when values change.",
      ),
      h3("Subscribe and push"),
      py(`from fastapi import FastAPI, WebSocket
import asyncio

app = FastAPI()

@app.websocket("/live/prices")
async def price_feed(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            price = await fetch_latest_price()  # your data source
            await websocket.send_json({"symbol": "PY", "price": price})
            await asyncio.sleep(1)
    except Exception:
        await websocket.close()`),
      p(
        "The server loop reads from a database, cache, or external feed and `send_json` to the client. Clients send a subscribe message with symbols they care about; filter before sending to save bandwidth.",
      ),
      h3("Backpressure and auth"),
      p(
        "Slow clients can build up queued messages. Close idle connections and authenticate during the handshake (query token or first message) before streaming sensitive data.",
      ),
      h2("Recap"),
      ul([
        "WebSockets suit server-initiated updates.",
        "Filter events per subscribed client.",
        "Authenticate and handle disconnects cleanly.",
      ]),
    ),
  },

  "websockets:connection-management": {
    quickAnswer:
      "Track connect/disconnect, handle WebSocketDisconnect, and clean up resources so leaked sockets do not exhaust server memory.",
    description:
      "Manage WebSocket connections in FastAPI—accept, disconnect, heartbeats, and cleanup to avoid leaked sockets.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Browsers close tabs, networks drop, and deploys restart servers. Without **connection management**, stale sockets stay in your manager list and memory grows. Production realtime APIs need explicit connect, disconnect, and heartbeat handling.",
      ),
      h3("Handle disconnects"),
      py(`from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

@app.websocket("/ws")
async def endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass  # client left; remove from room list here`),
      p(
        "`WebSocketDisconnect` fires when the client goes away. Remove the socket from your manager in a `finally` block so lists stay accurate.",
      ),
      h3("Heartbeats and timeouts"),
      p(
        "Send periodic ping frames or expect client pings within N seconds. Close connections that go silent—proxies and load balancers often kill idle WebSockets after 60 seconds unless traffic flows.",
      ),
      callout(
        "info",
        "Behind Nginx or a cloud load balancer, enable WebSocket upgrade headers and increase idle timeouts for long-lived connections.",
      ),
      h2("Recap"),
      ul([
        "Always remove disconnected clients from shared state.",
        "Use try/except or `finally` around the receive loop.",
        "Configure proxy timeouts and optional heartbeats.",
      ]),
    ),
  },

  "api-versioning:v1-v2-apis": {
    quickAnswer:
      "Expose v1 and v2 under URL prefixes like /api/v1 and /api/v2, mounting separate APIRouters so old clients keep working while new ones adopt v2.",
    description:
      "Structure FastAPI v1 and v2 APIs with URL prefixes and separate routers so old and new clients coexist.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Shipping breaking changes to a public API breaks mobile apps and partner integrations. **Versioned URLs** (`/api/v1/users`, `/api/v2/users`) make support explicit: v1 stays stable while v2 introduces new fields and behavior.",
      ),
      h3("Mount version routers"),
      py(`from fastapi import APIRouter, FastAPI

app = FastAPI()
v1 = APIRouter(prefix="/api/v1")
v2 = APIRouter(prefix="/api/v2")

@v1.get("/users/{user_id}")
def get_user_v1(user_id: int):
    return {"id": user_id, "name": "Ada"}

@v2.get("/users/{user_id}")
def get_user_v2(user_id: int):
    return {"id": user_id, "full_name": "Ada Lovelace", "tier": "pro"}

app.include_router(v1)
app.include_router(v2)`),
      p(
        "Each version lives in its own module (`app/api/v1/`, `app/api/v2/`). Shared business logic can sit in services; only response shapes differ per version.",
      ),
      h3("In practice"),
      p(
        "Ship v2 when you need breaking response shapes or new auth rules. Keep v1 routers read-only for a deprecation window and log traffic per version in middleware so you know when it is safe to retire old paths.",
      ),
      h2("Recap"),
      ul([
        "Prefix routes with `/api/v1` and `/api/v2`.",
        "One router (or package) per major version.",
        "Keep v1 online until clients migrate.",
      ]),
    ),
  },

  "api-versioning:backward-compatibility": {
    quickAnswer:
      "Avoid removing fields or changing types in place—add optional fields, default new behavior, and deprecate old endpoints before removal.",
    description:
      "Maintain backward-compatible FastAPI APIs—optional fields, safe defaults, and deprecation before breaking changes.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Clients cache OpenAPI schemas and hard-code JSON keys. Renaming `name` to `full_name` without a version bump breaks production apps. **Backward compatibility** means old clients keep working while new ones opt into improvements.",
      ),
      h3("Safe evolution tactics"),
      ul([
        "Add new fields as optional with defaults; never remove fields in the same version.",
        "Accept both old and new query parameter names during a transition.",
        "Return superset responses—extra keys are usually ignored by strict parsers.",
        "Document deprecations in OpenAPI `deprecated=True` and response headers.",
      ]),
      py(`from pydantic import BaseModel

class UserOut(BaseModel):
    name: str
    full_name: str | None = None  # new alias; old clients still read name`),
      p(
        "When behavior must change fundamentally, ship it under v2 and leave v1 untouched until usage metrics show zero traffic.",
      ),
      h2("Recap"),
      ul([
        "Prefer additive changes within a version.",
        "Deprecate before deleting.",
        "Use a new major version for true breaking changes.",
      ]),
    ),
  },

  "api-versioning:version-strategies": {
    quickAnswer:
      "Version APIs by URL path, Accept header, or query string—URL versioning is the most visible and common for public REST APIs.",
    description:
      "Compare FastAPI API versioning strategies—URL path, headers, query params, and when to use each.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Teams pick different **version strategies** based on who consumes the API. Public REST APIs favor clear URLs. Internal microservices sometimes negotiate version via headers. Picking one strategy early avoids mixed conventions.",
      ),
      h3("Common approaches"),
      ul([
        "**URL path** — `/v1/items` — easy to route, cache, and document in Swagger.",
        "**Header** — `Accept: application/vnd.myapi.v2+json` — keeps URLs clean; harder to test in a browser.",
        "**Query** — `?version=2` — simple but easy to forget; poor for cache keys.",
      ]),
      py(`from fastapi import APIRouter, Header, HTTPException

router = APIRouter()

@router.get("/items")
def list_items(accept: str | None = Header(default=None)):
    if accept and "v2" in accept:
        return {"items": [], "schema": 2}
    raise HTTPException(400, "Unsupported version")`),
      p(
        "FastAPI supports all patterns via routers, dependencies, or middleware. Whichever you choose, enforce it consistently and generate separate OpenAPI docs per major version when possible.",
      ),
      h2("Recap"),
      ul([
        "URL versioning is the default choice for public APIs.",
        "Header versioning suits hypermedia or vendor MIME types.",
        "Document one strategy; do not mix them on the same surface.",
      ]),
    ),
  },

  "testing:unit-testing": {
    quickAnswer:
      "Unit-test pure functions and service methods without HTTP—pass mocks for databases and external APIs so tests stay fast and isolated.",
    description:
      "Unit test FastAPI business logic without the network—isolate services, mock dependencies, and keep tests fast.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Not every test needs a running server. **Unit tests** target one function or class—price calculation, password rules, permission checks—with dependencies replaced by fakes. They run in milliseconds and pinpoint failures precisely.",
      ),
      h3("Test logic, not wiring"),
      py(`# app/services/discount.py
def apply_discount(price: float, percent: int) -> float:
    return price * (1 - percent / 100)

# tests/test_discount.py
def test_apply_discount():
    assert apply_discount(100, 10) == 90.0`),
      p(
        "Keep business rules out of route handlers. When logic lives in `services/`, unit tests import those modules directly without `TestClient`.",
      ),
      callout(
        "info",
        "Aim for many unit tests and fewer integration tests. Unit tests document edge cases; integration tests prove routes and databases work together.",
      ),
      h3("In practice"),
      p(
        "When a bug appears, write a failing unit test that reproduces the bad input, fix the service function, then add one integration test if wiring was also wrong. That order keeps feedback loops under a second for most runs.",
      ),
      h2("Recap"),
      ul([
        "Unit tests skip HTTP and ASGI.",
        "Test pure functions and service methods.",
        "Mock I/O at boundaries, not inside every line.",
      ]),
    ),
  },

  "testing:integration-testing": {
    quickAnswer:
      "Integration tests hit real routes with TestClient and often a test database—verify status codes, JSON bodies, and auth flows end to end.",
    description:
      "Integration test FastAPI apps with TestClient and a test database—verify routes, status codes, and JSON together.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Unit tests cannot catch wrong status codes, broken dependency injection, or SQLAlchemy session leaks. **Integration tests** exercise the full ASGI stack—routing, middleware, validation, and database—using FastAPI's test utilities.",
      ),
      h3("TestClient basics"),
      py(`from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_item():
    response = client.post("/items/", json={"name": "Widget"})
    assert response.status_code == 201
    assert response.json()["name"] == "Widget"`),
      p(
        "Use a separate test database or transactions rolled back after each test. Override `get_db` with a dependency that yields a test session so production data stays safe.",
      ),
      h3("In practice"),
      p(
        "Seed minimal fixtures—a user and one item—then assert the full create-read-update-delete path. If a test needs ten setup steps, extract a factory function so the test body stays readable and failures point at the behavior under test.",
      ),
      h2("Recap"),
      ul([
        "Integration tests use `TestClient` against `app`.",
        "Assert status codes and response JSON.",
        "Isolate data with fixtures and dependency overrides.",
      ]),
    ),
  },

  "testing:pytest": {
    quickAnswer:
      "Run FastAPI tests with pytest—name files test_*.py, use fixtures for app and client, and assert with plain assert statements.",
    description:
      "Run FastAPI tests with pytest—fixtures, test layout, and assert style for API projects.",
    body: mdx(
      h2("Why this matters"),
      p(
        "**pytest** is the standard test runner in Python web projects. It discovers tests automatically, supports fixtures for shared setup, and prints clear failure output—ideal for growing FastAPI codebases.",
      ),
      h3("Layout and discovery"),
      py(`# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

# tests/test_health.py
def test_health(client):
    assert client.get("/health").status_code == 200`),
      p(
        "Place tests in a top-level `tests/` folder. Shared fixtures live in `conftest.py`. Run `pytest` from the project root; add `-v` for verbose output and `-k name` to filter.",
      ),
      h3("Markers and async"),
      p(
        "Mark slow tests with `@pytest.mark.integration` and skip them in CI quick runs. For async route code tested without HTTP, use `pytest-asyncio` and `async def test_...` functions.",
      ),
      h3("In practice"),
      p(
        "Add `pytest.ini` with `testpaths = tests` and run the suite in GitHub Actions on every pull request. Failing tests should block merge; flaky tests get the same priority as production bugs because they erode trust in CI.",
      ),
      h2("Recap"),
      ul([
        "Use `tests/` + `test_*.py` naming.",
        "Fixtures provide `client`, db, and auth headers.",
        "Run `pytest` locally and in CI on every push.",
      ]),
    ),
  },

  "testing:testclient": {
    quickAnswer:
      "FastAPI's TestClient wraps your app with httpx—call .get(), .post(), and assert on .status_code and .json() without starting uvicorn.",
    description:
      "Use FastAPI TestClient for HTTP tests—GET, POST, headers, and JSON assertions without running uvicorn.",
    body: mdx(
      h2("Why this matters"),
      p(
        "**TestClient** simulates HTTP against your FastAPI app in-process. You get realistic routing, validation errors, and response serialization without binding a port or flaky network calls.",
      ),
      h3("Requests and auth"),
      py(`from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_protected_route():
    headers = {"Authorization": "Bearer test-token"}
    r = client.get("/me", headers=headers)
    assert r.status_code == 200`),
      p(
        "Pass `json=` for bodies, `params=` for query strings, and `files=` for uploads. Follow redirects with `follow_redirects=True` when testing OAuth callbacks.",
      ),
      callout(
        "warning",
        "TestClient runs synchronous wrappers around async code. For heavy async testing, consider `httpx.AsyncClient` with `ASGITransport` and `pytest-asyncio`.",
      ),
      h3("In practice"),
      p(
        "Create the client once per test module via a fixture. For authenticated routes, add a fixture that logs in or builds a valid JWT and returns headers your tests pass into every request.",
      ),
      h2("Recap"),
      ul([
        "`TestClient(app)` is the entry point.",
        "Use standard HTTP methods and assert on responses.",
        "Pass headers and JSON like a real client.",
      ]),
    ),
  },

  "testing:mocking": {
    quickAnswer:
      "Use unittest.mock.patch or pytest fixtures to replace external services and database calls so tests do not hit real APIs or SMTP.",
    description:
      "Mock external services in FastAPI tests—patch dependencies, fake SMTP, and isolate unit tests.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Tests that send real email or charge Stripe are slow, flaky, and expensive. **Mocking** swaps real implementations with fakes during a test so you control return values and assert call counts.",
      ),
      h3("Patch dependencies"),
      py(`from unittest.mock import patch

def test_notify(client):
    with patch("app.services.notify.send_email") as mock_send:
        mock_send.return_value = True
        response = client.post("/signup", json={"email": "a@b.com"})
        assert response.status_code == 201
        mock_send.assert_called_once()`),
      p(
        "Patch where the name is **used**, not where it is defined. In FastAPI, override dependencies with `app.dependency_overrides[get_mail_service] = lambda: FakeMail()` for cleaner injection-friendly tests.",
      ),
      h3("In practice"),
      p(
        "Reset overrides after each test so cases do not leak state: `app.dependency_overrides.clear()` in a fixture teardown. Prefer fakes with the same interface as real services over deep mock chains that break when you rename a method.",
      ),
      h2("Recap"),
      ul([
        "Mock external I/O, not your own business rules.",
        "Prefer `dependency_overrides` for FastAPI deps.",
        "Assert mocks were called with expected arguments.",
      ]),
    ),
  },

  "testing:api-testing": {
    quickAnswer:
      "API tests assert status codes, response schemas, and error bodies—cover happy paths, validation failures, and auth denials for each endpoint.",
    description:
      "API testing patterns for FastAPI—status codes, response schemas, auth failures, and validation errors.",
    body: mdx(
      h2("Why this matters"),
      p(
        "**API testing** checks the contract clients rely on: correct HTTP status, JSON shape, and error messages. A green service test means nothing if `POST /orders` returns `500` on invalid input instead of `422`.",
      ),
      h3("What to assert"),
      ul([
        "Happy path: `201` + body fields for creates; `200` + list shape for reads.",
        "Validation: missing fields → `422` with `detail` array from Pydantic.",
        "Auth: no token → `401`; wrong role → `403`.",
        "Not found: unknown id → `404`.",
      ]),
      py(`def test_list_users_pagination(client):
    r = client.get("/users/?limit=10&offset=0")
    assert r.status_code == 200
    data = r.json()
    assert "items" in data
    assert len(data["items"]) <= 10`),
      p(
        "Group tests by resource (`test_users.py`). Reuse factory fixtures to seed data. Keep OpenAPI as living documentation—tests should match what `/docs` promises.",
      ),
      h2("Recap"),
      ul([
        "Test contracts, not implementation details.",
        "Cover success, validation, auth, and 404 cases.",
        "Align assertions with your OpenAPI schema.",
      ]),
    ),
  },

  "logging:application-logging": {
    quickAnswer:
      "Configure Python's logging module once at startup—set level, format, and handlers so every module uses logger = logging.getLogger(__name__).",
    description:
      "Configure application logging in FastAPI with Python's logging module—levels, handlers, and per-module loggers.",
    body: mdx(
      h2("Why this matters"),
      p(
        "`print()` in production is invisible in centralized log systems. **Application logging** gives levels (DEBUG, INFO, WARNING), timestamps, and routing to stdout or files—essential when debugging deployed FastAPI services.",
      ),
      h3("Basic setup"),
      py(`import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)
logger = logging.getLogger(__name__)

logger.info("Application starting")`),
      p(
        "Call setup in your app factory or lifespan handler. Child loggers inherit config: `logging.getLogger('app.services.orders')` in each module.",
      ),
      callout(
        "info",
        "Set `LOG_LEVEL=DEBUG` via environment in development and `INFO` or `WARNING` in production to reduce noise.",
      ),
      h3("In practice"),
      p(
        "Route uvicorn access logs and application logs to the same aggregator. In Docker, log to stdout only—the platform collects it. Avoid creating a new log file per container replica. Tune third-party library loggers (SQLAlchemy, httpx) to WARNING so they do not drown out your messages.",
      ),
      h2("Recap"),
      ul([
        "Use `logging.getLogger(__name__)` per module.",
        "Configure once at startup, not per request.",
        "Control verbosity with environment-based levels.",
      ]),
    ),
  },

  "logging:error-logging": {
    quickAnswer:
      "Log exceptions with logger.exception() inside handlers or global exception handlers—capture stack traces without leaking internals to clients.",
    description:
      "Log errors and exceptions in FastAPI—logger.exception, global handlers, and safe client responses.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Users should see a generic error message; operators need the full traceback. **Error logging** records what failed, where, and with which request context—while HTTP responses stay safe.",
      ),
      h3("Log in exception handlers"),
      py(`import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)
app = FastAPI()

@app.exception_handler(Exception)
async def unhandled(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s", request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )`),
      p(
        "`logger.exception` includes the stack trace automatically. Register handlers for `HTTPException` separately if you need different log levels for expected client errors.",
      ),
      h3("In practice"),
      p(
        "Log expected 404s at INFO and unexpected 500s at ERROR. Attach `request_id` and authenticated `user_id` to error records so support can find the matching access log line without guessing.",
      ),
      h2("Recap"),
      ul([
        "Log full traces server-side with `logger.exception`.",
        "Return generic messages in JSON to clients.",
        "Use global handlers for uncaught errors.",
      ]),
    ),
  },

  "logging:request-logging": {
    quickAnswer:
      "Log method, path, status, and duration per request with middleware or access-log settings on uvicorn—correlate logs with a request id header.",
    description:
      "Log every FastAPI request—middleware, timing, status codes, and request IDs for tracing.",
    body: mdx(
      h2("Why this matters"),
      p(
        "When a user reports a failure at 14:32, you search logs by path and time. **Request logging** captures method, URL, status code, and duration for every HTTP call—often required for compliance and incident response.",
      ),
      h3("Middleware example"),
      py(`import logging
import time
from fastapi import Request

logger = logging.getLogger("access")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000
    logger.info(
        "%s %s %s %.1fms",
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
    )
    return response`),
      p(
        "Add a `X-Request-ID` header in the same middleware (generate UUID if missing) and include it in log lines to trace one request across services.",
      ),
      h3("In practice"),
      p(
        "Skip logging health-check paths at INFO to cut noise. Sample DEBUG logs for high-traffic read endpoints if volume is costly, but never sample authentication failures or payment errors.",
      ),
      h2("Recap"),
      ul([
        "HTTP middleware is the usual place for access logs.",
        "Log method, path, status, and duration.",
        "Propagate a request id for distributed tracing.",
      ]),
    ),
  },

  "logging:structured-logs": {
    quickAnswer:
      "Emit JSON logs with consistent keys (level, message, request_id, user_id) so Datadog, CloudWatch, or Loki can filter and aggregate them.",
    description:
      "Structured JSON logging in FastAPI—consistent fields for search, dashboards, and log aggregators.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Plain text logs are hard to query at scale. **Structured logs**—one JSON object per line—let you filter `status_code:500` or `user_id:42` in observability tools without regex fragility.",
      ),
      h3("JSON per line"),
      py(`import json
import logging

class JsonFormatter(logging.Formatter):
    def format(self, record):
        payload = {
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
        }
        return json.dumps(payload)

handler = logging.StreamHandler()
handler.setFormatter(JsonFormatter())
logging.getLogger().handlers = [handler]`),
      p(
        "Libraries like `structlog` build context progressively: bind `request_id` in middleware, add `user_id` in auth dependencies, and emit one rich event per significant action.",
      ),
      h3("In practice"),
      p(
        "Standardize field names across microservices (`duration_ms`, not `latency` in one repo and `elapsed` in another). Dashboards become reusable and on-call playbooks stay short when every team logs the same shape. Include `service` and `environment` on every line for multi-tenant filters.",
      ),
      h2("Recap"),
      ul([
        "Prefer JSON (or key=value) over free-form strings.",
        "Use stable field names across services.",
        "Bind request context once per HTTP call.",
      ]),
    ),
  },

  "configuration-management:environment-variables": {
    quickAnswer:
      "Read settings from os.environ or pydantic-settings so database URLs and API keys differ per machine without code changes.",
    description:
      "Use environment variables in FastAPI for database URLs, API keys, and per-environment settings.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Hard-coding database hosts or API keys in source code leads to leaks and painful deploys. **Environment variables** inject config at runtime—development on localhost, staging in the cloud, production with secrets from the platform.",
      ),
      h3("Reading env vars"),
      py(`import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")
DEBUG = os.getenv("DEBUG", "false").lower() == "true"`),
      p(
        "Access variables when the app starts, not on every request. Document required keys in `.env.example` so new developers know what to set.",
      ),
      callout(
        "warning",
        "Never commit real secrets. CI and production should inject values via the host environment or a secret manager.",
      ),
      h3("In practice"),
      p(
        "Fail fast at startup if a required variable is missing—better than a cryptic connection error on the first database request. Document each variable in README with example values safe to share.",
      ),
      h2("Recap"),
      ul([
        "Config comes from the environment, not constants in git.",
        "Provide defaults only for safe local development.",
        "Document required variable names.",
      ]),
    ),
  },

  "configuration-management:env-files": {
    quickAnswer:
      "Load a .env file in development with python-dotenv or pydantic-settings—keep .env out of git and use platform secrets in production.",
    description:
      "Load .env files in FastAPI development with pydantic-settings—local config without committing secrets.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Exporting twenty variables in your shell is tedious. A **`.env` file** stores key=value pairs for local runs while production still uses real environment injection from Docker or Kubernetes.",
      ),
      h3("pydantic-settings with .env"),
      py(`from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")
    database_url: str
    secret_key: str

settings = Settings()`),
      p(
        "Add `.env` to `.gitignore`. Commit `.env.example` with empty or placeholder values. `Settings()` loads from the file automatically in development.",
      ),
      h3("In practice"),
      p(
        "Keep `.env.example` in sync when you add settings fields—reviewers use it as a checklist. In Docker Compose, pass the same keys via `env_file` or `environment` so local containers match bare-metal runs. Never put production secrets in Compose files committed to git.",
      ),
      h2("Recap"),
      ul([
        ".env is for local convenience, not production storage.",
        "Never commit `.env` with real secrets.",
        "Use `BaseSettings` to load and validate values.",
        "Keep `.env.example` updated for every new setting.",
      ]),
    ),
  },

  "configuration-management:secrets-management": {
    quickAnswer:
      "Store production secrets in a vault or platform secret store (AWS Secrets Manager, Doppler)—inject at deploy time, not in the repo.",
    description:
      "Manage FastAPI secrets in production—vaults, platform env injection, and rotation without code deploys.",
    body: mdx(
      h2("Why this matters"),
      p(
        "API keys, JWT signing secrets, and database passwords are **secrets**. If they live in git history, assume compromise. Production FastAPI apps load secrets from secure stores at boot and rotate them without redeploying application code when possible.",
      ),
      h3("Practices"),
      ul([
        "Development: `.env` on your machine only.",
        "CI: masked variables in GitHub Actions or GitLab.",
        "Production: AWS Secrets Manager, GCP Secret Manager, Vault, or PaaS secret tabs.",
      ]),
      p(
        "Mount secrets as environment variables the process already reads—your `Settings` class stays the same; only the source changes. Restrict who can read production secret values in the cloud console.",
      ),
      callout(
        "info",
        "Rotate `SECRET_KEY` and database passwords on a schedule. Plan token invalidation when JWT signing keys change.",
      ),
      h3("In practice"),
      p(
        "Grant CI only the secrets that job needs—database URL for migration workflows, not production signing keys. Audit secret access quarterly and remove unused API keys from third-party dashboards.",
      ),
      h2("Recap"),
      ul([
        "Secrets never belong in source control.",
        "Use platform or vault injection in production.",
        "Rotate credentials without embedding them in code.",
      ]),
    ),
  },

  "configuration-management:settings-classes": {
    quickAnswer:
      "Define a Pydantic BaseSettings class for typed, validated config—import one settings instance across the app instead of scattered os.getenv calls.",
    description:
      "Centralize FastAPI config with Pydantic BaseSettings—typed fields, validation, and a single settings object.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Scattered `os.getenv` calls hide required keys until runtime crashes. A **settings class** validates types at import, documents fields, and gives IDEs autocomplete for `settings.database_url`.",
      ),
      h3("Single settings object"),
      py(`from functools import lru_cache
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "My API"
    database_url: str
    cors_origins: list[str] = ["http://localhost:3000"]

@lru_cache
def get_settings() -> Settings:
    return Settings()

# in main.py: settings = get_settings()`),
      p(
        "Use `@lru_cache` on `get_settings` so parsing happens once. Inject with `Depends(get_settings)` in routes that need config, or import the cached instance in modules that are not request-scoped.",
      ),
      h3("In practice"),
      p(
        "In tests, override `get_settings` to return a `Settings` instance with in-memory database URLs. That keeps pytest hermetic without touching your real `.env` file on disk. Validate list fields like `cors_origins` at startup so typos fail before the first browser preflight.",
      ),
      h2("Recap"),
      ul([
        "`BaseSettings` validates and types configuration.",
        "One cached instance avoids repeated parsing.",
        "Inject settings where tests can override them.",
      ]),
    ),
  },

  "project-architecture:scalable-folder-structures": {
    quickAnswer:
      "Split FastAPI projects into app/, api/routers, core/config, models, schemas, and services—avoid a single main.py as the app grows.",
    description:
      "Scalable FastAPI folder layout—routers, services, models, and config separated as the project grows.",
    body: mdx(
      h2("Why this matters"),
      p(
        "A hundred endpoints in `main.py` becomes unmaintainable. A **scalable folder structure** groups code by responsibility so teams find files quickly and tests import modules without circular imports.",
      ),
      h3("Typical layout"),
      py(`myapi/
  app/
    main.py          # FastAPI() + include_router
    core/
      config.py      # Settings
      deps.py        # shared Depends
    api/
      v1/
        users.py     # routers
    models/          # SQLAlchemy / SQLModel
    schemas/         # Pydantic request/response
    services/        # business logic
    repositories/    # database access`),
      p(
        "Start simple; extract folders when files exceed what you can scan in one screen. Keep `main.py` thin—create app, attach middleware, register routers.",
      ),
      h3("In practice"),
      p(
        "New engineers should find any endpoint in under a minute: router file by resource name, service for rules, repository for SQL. If people grep the whole repo for `session.query`, your boundaries need tightening.",
      ),
      h2("Recap"),
      ul([
        "Separate routers, schemas, models, and services.",
        "Version APIs under `api/v1/`.",
        "Grow structure with team size, not day one complexity.",
      ]),
    ),
  },

  "project-architecture:routers": {
    quickAnswer:
      "In larger FastAPI apps, each domain (users, orders) gets its own APIRouter module included from main—routers are the HTTP layer only.",
    description:
      "Organize FastAPI apps with domain routers—one module per resource, thin handlers, logic in services.",
    body: mdx(
      h2("Why this matters"),
      p(
        "At architecture level, **routers** map HTTP paths to handlers. They should stay thin: parse input, call a service, return a response model. Fat routers mix SQL, email, and validation—hard to test and reuse.",
      ),
      h3("Domain routers"),
      py(`# app/api/v1/users.py
from fastapi import APIRouter, Depends
from app.services import users as user_service

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/{user_id}")
def get_user(user_id: int):
    return user_service.get_user(user_id)`),
      p(
        "`main.py` only wires routers: `app.include_router(users.router, prefix='/api/v1')`. Cross-cutting concerns (auth, db session) live in `core/deps.py`.",
      ),
      h3("In practice"),
      p(
        "When a route grows past roughly thirty lines, move logic into a service and leave the handler as three steps: validate input, call service, map result to a response model. That habit keeps OpenAPI handlers easy to scan during review. Share response models in `schemas/` so routers do not redefine the same JSON shape.",
      ),
      h2("Recap"),
      ul([
        "One router module per domain or resource.",
        "Handlers delegate to services.",
        "Register all routers from a small main file.",
      ]),
    ),
  },

  "project-architecture:services": {
    quickAnswer:
      "Services hold business rules—create order, calculate tax—called by routers but independent of HTTP, so unit tests stay simple.",
    description:
      "FastAPI service layer pattern—business logic separate from routes for testing and reuse.",
    body: mdx(
      h2("Why this matters"),
      p(
        "The **service layer** encodes what your application does: place order, invite user, refund payment. Routers translate HTTP; services enforce rules and orchestrate repositories. The same service can back a CLI or background worker later.",
      ),
      h3("Example service function"),
      py(`# app/services/orders.py
def create_order(db, user_id: int, items: list[dict]) -> dict:
    if not items:
        raise ValueError("Cart is empty")
    total = sum(i["price"] * i["qty"] for i in items)
    order = save_order(db, user_id, total)
    return {"order_id": order.id, "total": total}`),
      p(
        "Services raise domain exceptions; routers catch them and map to `HTTPException`. Keep FastAPI imports out of services when possible.",
      ),
      h3("In practice"),
      p(
        "Name service functions after business events: `place_order`, not `post_order_handler`. Return plain dicts or Pydantic models, not `Response` objects, so the same function works from a Celery task or CLI script.",
      ),
      h2("Recap"),
      ul([
        "Business logic lives in `services/`.",
        "Routers call services; services call repositories.",
        "Unit-test services without TestClient.",
      ]),
    ),
  },

  "project-architecture:repositories": {
    quickAnswer:
      "Repositories wrap database queries—get_user_by_id, list_orders—so services stay free of SQLAlchemy details and swaps stay localized.",
    description:
      "Repository pattern in FastAPI—isolate SQLAlchemy queries from services and business logic.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Raw SQLAlchemy calls sprinkled in routes make refactoring painful. **Repositories** expose intent-shaped methods (`find_active_users`) and hide ORM queries, session flushing, and eager loading.",
      ),
      h3("Thin repository"),
      py(`# app/repositories/users.py
from sqlalchemy.orm import Session
from app.models import User

def get_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()`),
      p(
        "Services call `users.get_by_id(db, id)` instead of building queries inline. For tests, pass an in-memory SQLite session or fake repository implementing the same functions.",
      ),
      h3("In practice"),
      p(
        "One repository file per aggregate root (User, Order) keeps queries discoverable. Push joins and eager loading here so services read like workflows, not SQL textbooks. Return ORM models or simple dataclasses—never raw SQL rows unless you have a reporting use case.",
      ),
      h2("Recap"),
      ul([
        "Repositories = data access only.",
        "Services orchestrate; repositories persist.",
        "Swap storage by changing repository implementations.",
        "Keep query logic out of route handlers.",
      ]),
    ),
  },

  "project-architecture:modular-applications": {
    quickAnswer:
      "Package features as modules (users, billing) with their own router, schemas, and service—compose them in main for a modular monolith.",
    description:
      "Build modular FastAPI monoliths—feature packages with routers, schemas, and services composed in main.",
    body: mdx(
      h2("Why this matters"),
      p(
        "A **modular application** splits features into installable units. Each module owns its router, models, and tests. `main.py` composes modules—like microservices without separate deployables—so boundaries stay clear as the codebase grows.",
      ),
      h3("Feature module"),
      py(`# app/modules/billing/__init__.py
from .router import router

# app/main.py
from app.modules.billing import router as billing_router
app.include_router(billing_router, prefix="/api/v1")`),
      p(
        "Avoid modules importing each other's internals; depend on shared interfaces or events. Shared kernel code (auth, db) lives in `core/`.",
      ),
      h3("In practice"),
      p(
        "Treat each module's `router.py` as its public HTTP API and keep `services/` private to the module. Cross-module calls go through narrow functions or domain events, not through importing another module's repository file. Add a `README.md` inside large modules describing owned endpoints and dependencies.",
      ),
      h2("Recap"),
      ul([
        "One folder per feature with router + service.",
        "Compose modules from a thin main.",
        "Limit cross-module imports to public APIs.",
        "Document module boundaries for new contributors.",
      ]),
    ),
  },

  "project-architecture:large-scale-api-organization": {
    quickAnswer:
      "At scale, split by bounded context, use API versioning, shared platform libs, and strict layer rules—routers never import ORM models directly.",
    description:
      "Organize large FastAPI codebases—bounded contexts, versioning, layer rules, and platform libraries.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Teams of ten-plus engineers on one API need **conventions**, not just folders. Large-scale organization defines who owns which module, how versions ship, and which layers may call which—preventing spaghetti imports across domains.",
      ),
      h3("Principles"),
      ul([
        "**Bounded contexts** — billing does not query users tables directly; call a service or internal API.",
        "**Versioned public surface** — `/api/v1` frozen; experimental work in v2.",
        "**Layer rules** — routers → services → repositories → models; no skipping.",
        "**Platform package** — shared auth, logging, and metrics in one internal library.",
      ]),
      p(
        "Document architecture in `ARCHITECTURE.md`. Enforce with linters (import boundaries) and code review. Split into deployable services only when scaling or team ownership demands it—not prematurely.",
      ),
      h3("In practice"),
      p(
        "Run architecture reviews when a new team joins or a module exceeds five engineers touching it weekly. Agree on import rules before the repo becomes a ball of mud—retrofitting boundaries costs more than defining them early.",
      ),
      h2("Recap"),
      ul([
        "Contexts, versions, and layers beat one giant package.",
        "Enforce dependencies with tooling and review.",
        "Extract microservices when ownership or scale requires it.",
      ]),
    ),
  },

  "routers:apirouter": {
    quickAnswer:
      "Create routes with APIRouter instead of app directly—group related endpoints and include them in the main FastAPI app with include_router.",
    description:
      "FastAPI APIRouter basics—define route groups and mount them on the main app with include_router.",
    body: mdx(
      h2("Why this matters"),
      p(
        "`APIRouter` is FastAPI's tool for **grouping routes** before attaching them to the application. Prefixes, tags, and dependencies applied to the router affect every route inside—less repetition than decorating `app` repeatedly.",
      ),
      h3("Define and include"),
      py(`from fastapi import APIRouter, FastAPI

router = APIRouter()
app = FastAPI()

@router.get("/items/")
def list_items():
    return []

app.include_router(router, prefix="/api")`),
      p(
        "The effective path is `/api/items/`. Multiple routers let you split files by resource and test routers in isolation.",
      ),
      h3("In practice"),
      p(
        "Apply shared `dependencies=[Depends(get_current_user)]` on the router when every route in the file requires auth. That keeps decorators DRY and shows up clearly in generated OpenAPI security requirements. You can mount the same router twice with different prefixes when admin and public surfaces share handlers.",
      ),
      h2("Recap"),
      ul([
        "`APIRouter()` holds related route functions.",
        "`app.include_router(router, prefix=...)` mounts them.",
        "Share tags and dependencies at router level.",
        "Router-level `dependencies` apply to every route in the group.",
      ]),
    ),
  },

  "routers:splitting-routes": {
    quickAnswer:
      "Move each resource's routes into its own file (users.py, items.py) and include all routers from main—keeps files small and ownership clear.",
    description:
      "Split FastAPI routes across files—one router per resource and a thin main.py that wires them.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Merge conflicts on a thousand-line `main.py` slow teams down. **Splitting routes** by file means each developer works on `routers/orders.py` without touching unrelated endpoints.",
      ),
      h3("Pattern"),
      py(`# app/routers/items.py
from fastapi import APIRouter
router = APIRouter(prefix="/items", tags=["items"])

@router.get("/")
def list_items():
    return []

# app/main.py
from app.routers import items
app.include_router(items.router)`),
      p(
        "Re-export routers from `routers/__init__.py` if you prefer `from app.routers import items, users` in main. Keep shared dependencies in `deps.py`.",
      ),
      h3("In practice"),
      p(
        "Name files after the resource (`orders.py`), not the HTTP verb. When a file exceeds roughly two hundred lines, split by sub-resource (`orders_payments.py`) before it becomes a merge-conflict magnet. Import routers in `main.py` in a stable alphabetical order to reduce noisy diffs.",
      ),
      h2("Recap"),
      ul([
        "One file per resource router.",
        "Main only creates app and includes routers.",
        "Avoid circular imports by not importing main from routers.",
        "Split large router files before merge conflicts pile up.",
      ]),
    ),
  },

  "routers:route-prefixes": {
    quickAnswer:
      "Set prefix on APIRouter or include_router to avoid repeating /api/v1 on every decorator—prefixes stack when nested.",
    description:
      "FastAPI route prefixes on APIRouter and include_router—DRY paths and nested prefix stacking.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Repeating `/api/v1/users` on every decorator invites typos. **Route prefixes** attach a path segment to every route in a router—change the version in one place when you ship v2. Clients and caches see the full path, so prefixes are part of your public contract.",
      ),
      h3("Stacking prefixes"),
      py(`users = APIRouter(prefix="/users", tags=["users"])

@users.get("/")
def list_users():
    return []

app.include_router(users, prefix="/api/v1")
# final path: /api/v1/users/`),
      p(
        "Prefix on both `APIRouter` and `include_router` combines. Pick one primary place (usually `include_router`) to avoid confusing double prefixes.",
      ),
      h3("In practice"),
      p(
        "Trailing slashes matter: be consistent (`/users/` vs `/users`) or browsers and caches will treat them as different URLs. Document the convention in your API style guide. FastAPI can redirect between slash variants—pick one style and test clients against it.",
      ),
      h2("Recap"),
      ul([
        "Use `prefix=` on router or `include_router`.",
        "Paths on decorators are relative to the prefix.",
        "Centralize API version in one prefix string.",
        "Pick one trailing-slash style and stick to it.",
      ]),
    ),
  },

  "routers:tags-organization": {
    quickAnswer:
      "Set tags=['Users'] on APIRouter so OpenAPI groups endpoints in Swagger UI—match tags to your team's mental model.",
    description:
      "Organize FastAPI OpenAPI docs with router tags—group endpoints in Swagger UI by feature.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Swagger UI lists every endpoint. Without **tags**, clients scroll a flat list. Tags group related operations—Users, Orders, Admin—mirroring how you split routers and how frontend teams discuss features. Good tags make auto-generated docs feel intentional instead of overwhelming.",
      ),
      h3("Router-level tags"),
      py(`from fastapi import APIRouter

admin = APIRouter(prefix="/admin", tags=["Admin"])

@admin.get("/stats")
def stats():
    return {"active": 10}`),
      p(
        "Override per route with `@router.get(..., tags=['Reports'])` when one endpoint belongs elsewhere. Keep tag names consistent (title case, singular nouns) across the project.",
      ),
      h3("In practice"),
      p(
        "Frontend teams often browse `/docs` before reading prose docs. Tag names that match product areas (Billing, Inventory) reduce slack questions about which endpoint does what. Hide internal admin routes behind separate OpenAPI documents if partners should not see them.",
      ),
      h2("Recap"),
      ul([
        "Set `tags` on `APIRouter` for default grouping.",
        "Align tags with router modules.",
        "Consistent names improve `/docs` navigation.",
        "Per-route tags override when an endpoint is exceptional.",
      ]),
    ),
  },

  "pagination-filtering:limit-offset-pagination": {
    quickAnswer:
      "Accept limit and offset query params—SELECT with LIMIT/OFFSET—to return a page of results plus optional total count for UI pagination.",
    description:
      "Limit/offset pagination in FastAPI—query params, SQL LIMIT/OFFSET, and total counts for list endpoints.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Returning ten thousand rows in one JSON array hurts performance and UX. **Limit/offset pagination** returns a slice: `limit` rows starting at `offset` from the ordered result set. Clients request `?limit=20&offset=40` for page three.",
      ),
      h3("Route and query"),
      py(`from fastapi import Query

@app.get("/users")
def list_users(
    limit: int = Query(20, le=100),
    offset: int = Query(0, ge=0),
):
    users = db.query(User).offset(offset).limit(limit).all()
    return {"items": users, "limit": limit, "offset": offset}`),
      p(
        "Cap `limit` to prevent abuse. Document default ordering (e.g. `created_at DESC`). For large offsets, databases slow down—consider cursor pagination later.",
      ),
      h3("In practice"),
      p(
        "Return `total` count only when the UI needs page numbers—count queries are expensive on huge tables. For admin tables, a cached approximate total is often enough. Expose `has_more` boolean when you skip counts so mobile apps can show infinite scroll without page math.",
      ),
      h2("Recap"),
      ul([
        "`limit` + `offset` query params define the page.",
        "Validate bounds with `Query(..., le=100)`.",
        "Always define stable sort order.",
      ]),
    ),
  },

  "pagination-filtering:cursor-pagination": {
    quickAnswer:
      "Use an opaque cursor (often the last item's id or timestamp) instead of offset—stable for live feeds and faster on large tables.",
    description:
      "Cursor-based pagination in FastAPI—opaque cursors, keyset queries, and stable live feeds.",
    body: mdx(
      h2("Why this matters"),
      p(
        "High **offset** values scan and discard many rows. **Cursor pagination** asks for items after a known point—`?cursor=eyJpZCI6MTB9`—using indexed `WHERE id > :last_id` queries. It stays fast and avoids duplicates when new rows are inserted during paging.",
      ),
      h3("Keyset pattern"),
      py(`@app.get("/posts")
def list_posts(cursor: int | None = None, limit: int = 20):
    q = db.query(Post).order_by(Post.id)
    if cursor is not None:
        q = q.filter(Post.id > cursor)
    rows = q.limit(limit + 1).all()
    next_cursor = rows[-1].id if len(rows) > limit else None
    items = rows[:limit]
    return {"items": items, "next_cursor": next_cursor}`),
      p(
        "Encode cursors as opaque base64 if you expose composite keys (timestamp + id). Return `next_cursor=null` on the last page.",
      ),
      h3("In practice"),
      p(
        "Document that clients must not parse opaque cursors—only pass them back. Changing sort order breaks old cursors; version the list endpoint or accept a `sort` param baked into the cursor payload.",
      ),
      h2("Recap"),
      ul([
        "Cursor = bookmark in the sorted stream.",
        "Prefer keyset queries over large offsets.",
        "Great for infinite scroll and live feeds.",
      ]),
    ),
  },

  "pagination-filtering:sorting": {
    quickAnswer:
      "Let clients pass sort=field and order=asc|desc—whitelist allowed fields in code to prevent SQL injection via sort parameters.",
    description:
      "Sort list endpoints in FastAPI safely—whitelist sort fields and map to ORDER BY columns.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Tables need sortable columns—newest first, cheapest first. A **sort** query parameter must map only to allowed database columns. Passing user input directly into `ORDER BY` is an injection risk.",
      ),
      h3("Whitelist sort fields"),
      py(`SORT_FIELDS = {"created_at": User.created_at, "name": User.name}

@app.get("/users")
def list_users(sort: str = "created_at", order: str = "desc"):
    column = SORT_FIELDS.get(sort)
    if column is None:
        raise HTTPException(400, "Invalid sort field")
    q = db.query(User)
    q = q.order_by(column.desc() if order == "desc" else column.asc())
    return q.limit(20).all()`),
      p(
        "Combine sorting with pagination: apply `order_by` before `limit`. Default sort should match your most common UI view.",
      ),
      h3("In practice"),
      p(
        "Expose `sort` and `order` in OpenAPI with enum examples so generated clients validate early. Reject unknown sort fields with 400 and a message listing allowed values.",
      ),
      h2("Recap"),
      ul([
        "Never interpolate raw sort strings into SQL.",
        "Whitelist field names to ORM columns.",
        "Apply sort before limit/offset or cursor filter.",
      ]),
    ),
  },

  "pagination-filtering:search-filters": {
    quickAnswer:
      "Expose optional query filters (q, status, min_price)—build SQLAlchemy queries dynamically only for provided params.",
    description:
      "Search and filter FastAPI list endpoints—optional query params and dynamic SQLAlchemy WHERE clauses.",
    body: mdx(
      h2("Why this matters"),
      p(
        "List endpoints rarely return everything. **Search filters** narrow results: text search on title, status equals `active`, price between min and max. FastAPI turns query strings into typed parameters; your service builds the query.",
      ),
      h3("Optional filters"),
      py(`@app.get("/products")
def search_products(
    q: str | None = None,
    category: str | None = None,
    min_price: float | None = None,
):
    stmt = select(Product)
    if q:
        stmt = stmt.where(Product.name.ilike(f"%{q}%"))
    if category:
        stmt = stmt.where(Product.category == category)
    if min_price is not None:
        stmt = stmt.where(Product.price >= min_price)
    return db.execute(stmt).scalars().all()`),
      p(
        "Validate enums (`status`) against allowed values. For full-text search at scale, use database FTS or Elasticsearch instead of leading `%` wildcards on huge tables.",
      ),
      h3("In practice"),
      p(
        "Cap string search length and strip whitespace before querying. Log slow filter combinations in development so you can add indexes before production traffic hits them.",
      ),
      h2("Recap"),
      ul([
        "Optional query params become WHERE clauses.",
        "Validate enums and numeric ranges.",
        "Pair filters with pagination and sort.",
      ]),
    ),
  },

  "rate-limiting:protecting-apis": {
    quickAnswer:
      "Rate limit public endpoints with middleware or a library (slowapi)—cap requests per IP or API key to reduce abuse and cost.",
    description:
      "Protect FastAPI APIs with rate limiting—per-IP caps, middleware, and libraries like slowapi.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Open APIs face scrapers, credential stuffing, and accidental infinite loops. **Rate limiting** caps how many requests a client may make per window—protecting databases, third-party quotas, and your bill.",
      ),
      h3("Basic limit with slowapi"),
      py(`from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.get("/public/data")
@limiter.limit("60/minute")
def public_data(request: Request):
    return {"ok": True}`),
      p(
        "Key by IP for anonymous traffic; use API key or user id for authenticated tiers. Return `429 Too Many Requests` with `Retry-After` when exceeded.",
      ),
      h3("In practice"),
      p(
        "Start with generous limits and tighten using metrics. Document limits in your public API docs so integrators handle 429 responses with exponential backoff instead of retry storms. Whitelist health checks and internal monitoring IPs so uptime probes never trip limits.",
      ),
      h2("Recap"),
      ul([
        "Apply limits to expensive and auth endpoints first.",
        "Return 429 with clear retry guidance.",
        "Tune limits per route sensitivity.",
      ]),
    ),
  },

  "rate-limiting:throttling-requests": {
    quickAnswer:
      "Throttle by sliding or fixed window—e.g. 100 requests per minute per key—using Redis for distributed limits across multiple workers.",
    description:
      "Throttle FastAPI requests with fixed and sliding windows—Redis-backed limits across workers.",
    body: mdx(
      h2("Why this matters"),
      p(
        "**Throttling** enforces average request rates while allowing short bursts depending on algorithm. A fixed window (`100/minute`) is simple; sliding windows smooth spikes. Multiple uvicorn workers need a **shared store** (Redis) so limits are global, not per process.",
      ),
      h3("Distributed counter"),
      p(
        "Increment a Redis key `rate:{user_id}:{minute}` with TTL. Before handling the request, compare count to max; reject if over. Libraries encode these patterns; custom code is fine for learning.",
      ),
      callout(
        "info",
        "Separate limits for read (GET) and write (POST) endpoints—writes are usually more expensive.",
      ),
      h3("In practice"),
      p(
        "Premium API keys can map to higher Redis limits without code forks—store tier name in the key metadata. Free tiers get stricter POST limits to protect shared databases. Alert when Redis is unavailable—decide whether to fail open or closed before an incident.",
      ),
      h2("Recap"),
      ul([
        "Use Redis when running multiple app instances.",
        "Pick fixed or sliding window based on burst tolerance.",
        "Stricter limits on POST, login, and search.",
      ]),
    ),
  },

  "rate-limiting:abuse-prevention": {
    quickAnswer:
      "Combine rate limits with auth, CAPTCHA on signup, IP blocklists, and monitoring—no single layer stops all abuse.",
    description:
      "Prevent API abuse in FastAPI—rate limits plus auth, CAPTCHA, blocklists, and alerting.",
    body: mdx(
      h2("Why this matters"),
      p(
        "Attackers bypass naive per-IP limits with botnets. **Abuse prevention** layers defenses: authentication, stricter limits on sensitive routes, anomaly detection, and partnerships with CDN/WAF providers.",
      ),
      h3("Layered defenses"),
      ul([
        "Rate limit login and password reset aggressively.",
        "Require API keys for programmatic access; revoke abused keys.",
        "Log and alert on 429 spikes and unusual geographic patterns.",
        "Use Cloudflare or similar WAF in front of public APIs.",
      ]),
      p(
        "Return generic errors on auth failures—do not reveal whether an email exists. Pair limits with idempotency keys on payment endpoints to block replay floods.",
      ),
      h3("In practice"),
      p(
        "Review 429 rates weekly. A sudden spike on `/login` may mean credential stuffing; a spike on `/search` may mean a scraper. Automate temporary IP blocks only with human review to avoid locking out NAT offices.",
      ),
      h2("Recap"),
      ul([
        "Rate limiting is one layer, not the whole solution.",
        "Protect auth and write endpoints hardest.",
        "Monitor, alert, and block at the edge when needed.",
      ]),
    ),
  },
};
