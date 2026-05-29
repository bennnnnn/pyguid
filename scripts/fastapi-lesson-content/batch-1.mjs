export const LESSONS = {
  "introduction-to-fastapi:what-is-fastapi": {
    quickAnswer:
      "FastAPI is a modern Python framework for building HTTP APIs with automatic validation, OpenAPI docs, and high performance on ASGI servers.",
    description:
      "Learn what FastAPI is, how it compares to a plain web framework, and why teams choose it for JSON APIs and microservices.",
    body: `## Why this matters

Before you write routes or models, you need a clear picture of what FastAPI actually is. It is not a full CMS like Django; it is a focused toolkit for building HTTP APIs that speak JSON (and more). Knowing that scope helps you pick the right tool and set realistic expectations for batteries included versus bring your own database layer.

## explanation

FastAPI sits on top of **Starlette** (routing, requests, WebSockets) and **Pydantic** (data validation). You declare path operations with decorators such as \`@app.get\`, type-annotate parameters, and FastAPI validates incoming data and generates an **OpenAPI** schema automatically. That schema powers interactive docs at \`/docs\` without extra boilerplate.

You run apps with an **ASGI** server such as Uvicorn. FastAPI supports both sync and async route functions, so you can start simple and adopt \`async def\` when you need concurrent I/O. The framework targets developers who want Flask-like ergonomics with stronger typing and fewer manual validation checks.

\`\`\`python
from fastapi import FastAPI

app = FastAPI(title="Inventory API")

@app.get("/health")
def health():
    return {"status": "ok"}
\`\`\`

## Recap

- FastAPI is for **HTTP APIs**, especially JSON REST-style services.
- Built on **Starlette + Pydantic** with automatic **OpenAPI** docs.
- Run with an **ASGI** server like Uvicorn; sync and async routes are supported.`,
  },

  "introduction-to-fastapi:why-fastapi-became-popular": {
    quickAnswer:
      "FastAPI grew quickly because it combines speed benchmarks, editor-friendly type hints, automatic docs, and less boilerplate than older Python API stacks.",
    description:
      "Understand the main reasons FastAPI adoption surged: performance, developer experience, validation, and interactive API documentation.",
    body: `## Why this matters

Framework hype fades; lasting adoption comes from daily developer wins. FastAPI became popular because it removed repetitive validation code, made APIs self-documenting, and still scored near Node and Go in throughput benchmarks on typical JSON workloads.

## explanation

Three forces drove adoption. **Performance**: ASGI plus efficient request handling keeps latency low without leaving Python. **Developer experience**: type hints power autocomplete in VS Code and PyCharm, and mistakes surface earlier. **Documentation**: every route appears in Swagger UI because OpenAPI is generated from your signatures and Pydantic models.

Teams also appreciated **standards alignment**—OAuth2 password flows, WebSockets, and background tasks have first-class patterns in the official docs. Startups could ship a typed API in an afternoon; enterprises could enforce schemas at the edge of every endpoint. The learning curve stays gentle if you already know Python functions and type annotations.

\`\`\`python
from pydantic import BaseModel
from fastapi import FastAPI

class Item(BaseModel):
    name: str
    price: float

app = FastAPI()

@app.post("/items")
def create_item(item: Item):
    return item  # validated + documented automatically
\`\`\`

## Recap

- Popularity comes from **speed**, **typing**, and **auto-generated docs**.
- Less manual validation glue compared to many older stacks.
- Fits startups and teams that want **OpenAPI** as a living contract.`,
  },

  "introduction-to-fastapi:fastapi-vs-flask-vs-django": {
    quickAnswer:
      "Use FastAPI for typed JSON APIs, Flask for minimal flexible apps, and Django when you need an admin site, ORM, and batteries-included web platform.",
    description:
      "Compare FastAPI, Flask, and Django so you can choose the right Python framework for APIs versus full websites.",
    body: `## Why this matters

Picking a framework on hype alone leads to rework. FastAPI, Flask, and Django solve overlapping but different problems. Matching the tool to the product—API-only versus content site versus enterprise monolith—saves months of fighting the framework.

## explanation

**Flask** is a microframework: you add extensions for validation, async, and admin. It is flexible and familiar, but OpenAPI and request validation are manual unless you add libraries.

**Django** is a full web platform: ORM, admin, templates, auth, migrations. It excels at server-rendered sites and large apps with many built-ins. For a pure mobile-backend JSON API, Django can feel heavy.

**FastAPI** targets **APIs first**: automatic validation, async-friendly ASGI, and interactive docs by default. It does not ship a built-in admin or ORM—you pair SQLAlchemy, SQLModel, or an external service. Many teams use Django for the public site and FastAPI for high-throughput microservices.

\`\`\`python
# FastAPI: schema-first API endpoint
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class UserOut(BaseModel):
    id: int
    email: str

@app.get("/users/{user_id}", response_model=UserOut)
def get_user(user_id: int):
    return {"id": user_id, "email": "a@example.com"}
\`\`\`

## Recap

- **Flask**: minimal, bring your own pieces.
- **Django**: full web app platform with admin and ORM.
- **FastAPI**: typed JSON APIs with validation and OpenAPI built in.`,
  },

  "introduction-to-fastapi:asgi-vs-wsgi": {
    quickAnswer:
      "WSGI serves synchronous Python web apps; ASGI adds async, WebSockets, and long-lived connections—FastAPI requires ASGI servers like Uvicorn.",
    description:
      "Learn how ASGI differs from WSGI and why FastAPI runs on ASGI instead of traditional WSGI workers.",
    body: `## Why this matters

Deployment errors often trace back to running an ASGI app behind a WSGI-only gateway without an adapter. Understanding ASGI versus WSGI explains why FastAPI uses Uvicorn, how WebSockets work, and when async routes actually help.

## explanation

**WSGI** (Web Server Gateway Interface) is the older standard used by Flask and Django for years. One request tends to block a worker until the response finishes. That model is simple and battle-tested for CPU-bound or short database calls.

**ASGI** (Asynchronous Server Gateway Interface) supports **async** event loops, **WebSockets**, and HTTP/2 features. FastAPI is an ASGI framework built on Starlette. You deploy with **Uvicorn**, **Hypercorn**, or **Daphne**, often behind Nginx. Sync route functions still work—ASGI runs them in a thread pool—but \`async def\` routes can await network I/O without blocking other requests on the same worker.

\`\`\`python
# ASGI app object (what Uvicorn imports)
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"protocol": "ASGI"}
\`\`\`

Run locally: \`uvicorn main:app --reload\`

## Recap

- **WSGI**: classic sync Python web stack.
- **ASGI**: async-capable; required for FastAPI and WebSockets.
- Deploy FastAPI with an **ASGI server** such as Uvicorn.`,
  },

  "introduction-to-fastapi:fastapi-architecture-overview": {
    quickAnswer:
      "A FastAPI app layers HTTP routing (Starlette), validation and schemas (Pydantic), optional dependencies, and your business logic behind an ASGI server.",
    description:
      "See how Starlette, Pydantic, dependencies, and path operations fit together in a typical FastAPI application.",
    body: `## Why this matters

When debugging or scaling, you need to know which layer owns what. Routing errors differ from validation errors, and both differ from database exceptions. A mental model of the stack speeds up fixes and cleaner project structure.

## explanation

At the bottom, an **ASGI server** (Uvicorn) speaks HTTP to clients. **Starlette** provides routing, requests, responses, middleware, and background tasks. **FastAPI** adds decorator-based path operations, dependency injection, and OpenAPI generation.

Incoming requests flow through **middleware**, then a **path operation** matched by method and path. FastAPI parses **path**, **query**, **header**, **cookie**, and **body** parameters using type hints. **Pydantic models** validate bodies and can validate responses. **Dependencies** (\`Depends\`) run first—ideal for DB sessions, auth, and shared settings. Your function returns a dict, model, or \`Response\`; FastAPI serializes JSON and applies status codes.

\`\`\`python
from fastapi import FastAPI, Depends

app = FastAPI()

def settings():
    return {"debug": True}

@app.get("/info")
def info(cfg: dict = Depends(settings)):
    return cfg
\`\`\`

## Recap

- **Uvicorn → Starlette → FastAPI → your code**.
- **Pydantic** validates request and response data.
- **Dependencies** inject shared resources before route logic runs.`,
  },

  "introduction-to-fastapi:real-world-use-cases": {
    quickAnswer:
      "FastAPI is widely used for REST microservices, ML model servers, internal tools, webhooks, and backends for React, Vue, or mobile apps.",
    description:
      "Explore common production uses of FastAPI—from ML inference APIs to SaaS backends and event-driven webhooks.",
    body: `## Why this matters

Seeing real deployments helps you design endpoints, auth, and observability from day one. FastAPI is not only tutorial CRUD—it powers high-traffic APIs when paired with proper databases, caching, and deployment practices.

## explanation

**Machine learning serving**: wrap a scikit-learn or PyTorch model behind \`POST /predict\` with Pydantic input/output models so clients get a stable contract. **Mobile and SPA backends**: React or Flutter apps consume JSON from FastAPI while CORS and JWT auth protect routes. **Microservices**: small services behind an API gateway communicate over HTTP with generated OpenAPI clients.

**Webhooks and integrations**: Stripe, GitHub, or Slack send events to FastAPI endpoints; background tasks acknowledge quickly and process asynchronously. **Internal admin APIs**: replace ad-hoc scripts with documented endpoints your team can test in \`/docs\`. Companies such as Microsoft, Netflix, and Uber have published case studies or talks mentioning FastAPI-style stacks for Python services.

\`\`\`python
from pydantic import BaseModel
from fastapi import FastAPI

class PredictIn(BaseModel):
    features: list[float]

class PredictOut(BaseModel):
    label: str
    score: float

app = FastAPI()

@app.post("/predict", response_model=PredictOut)
def predict(body: PredictIn):
    return {"label": "cat", "score": 0.91}
\`\`\`

## Recap

- Strong fit for **JSON APIs**, **ML inference**, and **SPA/mobile backends**.
- Works well in **microservice** and **webhook** architectures.
- Pair with production concerns: auth, DB pooling, logging, and tests.`,
  },

  "environment-setup:installing-python": {
    quickAnswer:
      "Install Python 3.10+ from python.org, pyenv, or your OS package manager, then verify with python3 --version before creating a project virtual environment.",
    description:
      "Install a supported Python version for FastAPI development and confirm your shell uses the correct interpreter.",
    body: `## Why this matters

FastAPI requires modern Python features used by Pydantic v2 and type hints. Running an end-of-life Python version leads to cryptic install errors or missing syntax. A clean Python install is the foundation for reproducible virtual environments.

## explanation

Use **Python 3.10 or newer** (3.11 or 3.12 are common choices). On macOS, install from [python.org](https://www.python.org/downloads/) or Homebrew (\`brew install python\`). On Linux, use your distro packages or **pyenv** to pin versions per project. On Windows, enable "Add Python to PATH" in the installer.

After install, confirm the interpreter:

\`\`\`bash
python3 --version
which python3
\`\`\`

Avoid mixing system Python with project tools—always create a **venv** per FastAPI project so \`pip install\` does not touch OS packages.

\`\`\`python
import sys
print(sys.version_info)  # should be >= (3, 10)
\`\`\`

On teams, pin the minor Python version in documentation so local machines and Docker images stay aligned. Upgrading Python may require reinstalling wheels for compiled dependencies.

## Recap

- Target **Python 3.10+** for current FastAPI and Pydantic.
- Verify with \`python3 --version\`.
- Use a **virtual environment** for every project.`,
  },

  "environment-setup:creating-virtual-environments": {
    quickAnswer:
      "Run python3 -m venv .venv, activate it, then pip install packages so dependencies stay isolated per FastAPI project.",
    description:
      "Create and activate a Python virtual environment for FastAPI so dependencies do not conflict with other projects.",
    body: `## Why this matters

Global pip installs cause version conflicts between client projects. A virtual environment gives you one known set of packages for FastAPI, Uvicorn, and your database driver—critical when deploying or sharing a requirements file.

## explanation

From your project folder:

\`\`\`bash
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\\Scripts\\activate
pip install --upgrade pip
\`\`\`

Your shell prompt usually shows \`(.venv)\`. While active, \`python\` and \`pip\` point inside \`.venv\`. Add \`.venv/\` to \`.gitignore\`; commit **requirements.txt** or **pyproject.toml** instead.

Deactivate with \`deactivate\`. IDEs like VS Code can select the \`.venv\` interpreter so Run/Debug uses the same environment as the terminal.

\`\`\`python
# After activation, this uses the venv interpreter
import fastapi  # available only after pip install fastapi
\`\`\`

Treat the venv as disposable: delete \`.venv\` and recreate it if dependencies become corrupted. Document the Python version in a \`.python-version\` file when your team uses pyenv.

## Recap

- Create with \`python3 -m venv .venv\`.
- **Activate** before installing or running the server.
- Never commit the venv folder; commit dependency lists.`,
  },

  "environment-setup:installing-fastapi": {
    quickAnswer:
      "With your venv active, run pip install fastapi to get FastAPI plus Starlette and Pydantic dependencies.",
    description:
      "Install FastAPI and its core dependencies inside your virtual environment using pip.",
    body: `## Why this matters

Installing into the wrong environment is the top cause of "ModuleNotFoundError: fastapi" when starting Uvicorn. Installing FastAPI inside an activated venv ensures imports and deployment images stay aligned.

## explanation

Activate your virtual environment, then:

\`\`\`bash
pip install "fastapi[standard]"
\`\`\`

The **standard** extra pulls common tooling (including Uvicorn in recent bundles). Minimal install: \`pip install fastapi\`. Pin versions for production:

\`\`\`bash
pip freeze > requirements.txt
\`\`\`

Verify:

\`\`\`python
import fastapi
print(fastapi.__version__)
\`\`\`

FastAPI does not include a production database driver—you add SQLAlchemy, asyncpg, or similar separately when needed.

After install, open a Python REPL and \`import fastapi\` to confirm the venv is active. CI pipelines should install from the same \`requirements.txt\` hash you use locally.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Install with **pip** inside an active **venv**.
- Consider \`fastapi[standard]\` for batteries-included dev tooling.
- Record versions in **requirements.txt**.`,
  },

  "environment-setup:installing-uvicorn": {
    quickAnswer:
      "Install Uvicorn with pip install uvicorn and run your app via uvicorn main:app --reload for local development.",
    description:
      "Install the Uvicorn ASGI server and learn the basic command to serve a FastAPI application.",
    body: `## Why this matters

FastAPI defines the application object; something must listen on a port and speak HTTP. Uvicorn is the standard ASGI server for local dev and many production deployments.

## explanation

\`\`\`bash
pip install uvicorn
\`\`\`

If your app lives in \`main.py\` as \`app = FastAPI()\`:

\`\`\`bash
uvicorn main:app --host 0.0.0.0 --port 8000
\`\`\`

- \`main\` = Python module name (without \`.py\`)
- \`app\` = FastAPI instance variable
- \`--host 0.0.0.0\` exposes to LAN containers
- \`--reload\` watches files during development (never use in production)

\`\`\`python
# main.py
from fastapi import FastAPI
app = FastAPI()
\`\`\`

Production often uses **Gunicorn** with Uvicorn workers for multiple processes.

If \`uvicorn: command not found\` appears, the venv is not activated or Scripts is not on PATH on Windows. Install \`uvicorn[standard]\` when you need WebSocket and HTTP/2 extras.

## Recap

- **Uvicorn** is the ASGI server that runs \`app\`.
- Command pattern: \`uvicorn module:app\`.
- Use \`--reload\` only in development.`,
  },

  "environment-setup:project-structure-setup": {
    quickAnswer:
      "Start with main.py for the FastAPI app, a routers/ package for endpoints, and optional models/ and services/ folders as the API grows.",
    description:
      "Organize a small but scalable FastAPI project folder layout for routes, models, and configuration.",
    body: `## Why this matters

Flat single-file apps are fine for learning, but teams need structure before dozens of routes land in one file. A predictable layout makes imports, tests, and code review easier.

## explanation

A practical starter layout:

\`\`\`text
myapi/
  .venv/
  app/
    __init__.py
    main.py          # FastAPI() + include_router
    routers/
      items.py
    models/
      item.py        # Pydantic schemas
    dependencies.py
  requirements.txt
  .gitignore
\`\`\`

\`main.py\` creates the app and mounts routers:

\`\`\`python
from fastapi import FastAPI
from app.routers import items

app = FastAPI()
app.include_router(items.router, prefix="/items", tags=["items"])
\`\`\`

Keep **settings** (database URL, secrets) in environment variables or a \`config.py\` loaded once. Run from project root: \`uvicorn app.main:app --reload\`.

As teams grow, add \`tests/\` mirroring \`app/\` and keep environment-specific settings out of git. A \`README\` with the exact \`uvicorn\` module path prevents onboarding confusion.

## Recap

- Split **routers**, **models**, and **dependencies** as you grow.
- \`main.py\` wires the app; feature code lives in packages.
- Run Uvicorn with the correct **module path**.`,
  },

  "environment-setup:running-the-first-server": {
    quickAnswer:
      "Save a FastAPI app in main.py, run uvicorn main:app --reload, then open http://127.0.0.1:8000/docs to see your API.",
    description:
      "Start your first FastAPI server locally and confirm the root URL and interactive documentation work.",
    body: `## Why this matters

Seeing a live response proves your environment, imports, and server command are correct. The interactive docs page is FastAPI's fastest feedback loop for new endpoints.

## explanation

Create \`main.py\`:

\`\`\`python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI"}
\`\`\`

Start the server:

\`\`\`bash
uvicorn main:app --reload
\`\`\`

Visit:

- http://127.0.0.1:8000/ — JSON greeting
- http://127.0.0.1:8000/docs — Swagger UI
- http://127.0.0.1:8000/redoc — alternative docs

Stop with **Ctrl+C**. If the port is busy, pass \`--port 8001\`.

If the browser cannot connect, check firewalls and that you used \`127.0.0.1\` rather than a wrong port. Leave the terminal open while testing—stopping the server is required before binding the same port in another process.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Define \`app = FastAPI()\` and at least one route.
- Run **uvicorn main:app --reload**.
- Confirm **/** and **/docs** in the browser.`,
  },

  "environment-setup:hot-reload-reload": {
    quickAnswer:
      "Uvicorn's --reload flag restarts the server when you save Python files, speeding up local API development.",
    description:
      "Use Uvicorn hot reload during development and know why you must disable it in production.",
    body: `## Why this matters

Restarting the server manually after every edit wastes time. Hot reload keeps flow state in your editor while the ASGI process picks up code changes—until you forget reload is unsafe in production.

## explanation

\`\`\`bash
uvicorn main:app --reload
\`\`\`

Uvicorn watches Python files and restarts workers when they change. Large projects may tune watch directories or exclude \`.venv\`. Some teams prefer **fastapi dev** when using the standard extra—both aim at the same developer experience.

**Production warning**: \`--reload\` spawns a reloader process and can leave half-initialized state. In production use a process manager (systemd, Docker, Kubernetes) **without** reload, often multiple workers:

\`\`\`bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
\`\`\`

\`\`\`python
# Edit this route, save, refresh browser — no manual restart
@app.get("/ping")
def ping():
    return {"pong": True}
\`\`\`

## Recap

- **--reload** is for **local development only**.
- Saves restart friction while editing routes and models.
- Production uses **multiple workers**, not reload.`,
  },

  "your-first-api:creating-a-fastapi-app": {
    quickAnswer:
      "Import FastAPI, create app = FastAPI(), and add path operation functions decorated with @app.get, @app.post, and similar.",
    description:
      "Create your first FastAPI application instance and understand what the app object represents.",
    body: `## Why this matters

Every route, middleware, and dependency hangs off the **FastAPI** instance. Creating the app correctly is the first line of every project and the import target Uvicorn needs.

## explanation

\`\`\`python
from fastapi import FastAPI

app = FastAPI(
    title="Bookshop API",
    version="1.0.0",
    description="Manage catalog and orders",
)

@app.get("/health")
def health_check():
    return {"ok": True}
\`\`\`

The \`app\` object registers routes, exception handlers, and middleware. Constructor kwargs set **OpenAPI metadata** shown in \`/docs\`. Uvicorn imports this object by name: \`uvicorn main:app\`.

You can mount sub-applications or include **APIRouter** modules later; start with one file until routes multiply.

You can mount multiple apps or use \`lifespan\` handlers later for startup tasks. For now, keep \`main.py\` small and move routes out once you have more than a handful of endpoints.

## Recap

- \`app = FastAPI(...)\` is the central application object.
- Metadata kwargs improve generated documentation.
- Uvicorn runs \`module:app\` where \`app\` is this instance.`,
  },

  "your-first-api:defining-routes": {
    quickAnswer:
      "Routes are Python functions decorated with @app.get, @app.post, etc., where the decorator path is the URL clients request.",
    description:
      "Define URL routes in FastAPI using path operation decorators and handler functions.",
    body: `## Why this matters

Clients discover your API through URLs and HTTP methods. Defining routes clearly separates endpoints, avoids duplicate paths, and sets the contract your frontend or mobile app will call.

## explanation

Each **path operation** pairs an HTTP method with a URL pattern:

\`\`\`python
from fastapi import FastAPI

app = FastAPI()

@app.get("/books")
def list_books():
    return [{"id": 1, "title": "Dune"}]

@app.get("/books/{book_id}")
def get_book(book_id: int):
    return {"id": book_id, "title": "Dune"}

@app.post("/books")
def create_book():
    return {"id": 2, "title": "New book"}
\`\`\`

Function names are for Python only—they do not appear in the URL. Paths are case-sensitive; trailing slashes can matter depending on configuration—pick one style and stay consistent.

Name paths with nouns (\`/users\`) and avoid file extensions in URLs. Group related routes in separate modules when the list grows beyond one screen.

## Recap

- Use **@app.get/post decorators** on handler functions.
- Path segments in braces become **parameters**.
- Keep URL naming consistent across the API.`,
  },

  "your-first-api:get-requests": {
    quickAnswer:
      "GET endpoints return data without changing server state; define them with @app.get and return dicts or Pydantic models for JSON.",
    description:
      "Build read-only GET endpoints in FastAPI that return JSON to browsers and API clients.",
    body: `## Why this matters

GET is the safest, cache-friendly method for fetching resources. Most public API traffic is GET. Designing clear read endpoints first helps you model resources before adding creates and updates.

## explanation

\`\`\`python
from fastapi import FastAPI

app = FastAPI()
ITEMS = {1: {"name": "Pen"}}

@app.get("/items/{item_id}")
def read_item(item_id: int):
    return ITEMS.get(item_id, {"error": "not found"})

@app.get("/search")
def search(q: str | None = None):
    return {"query": q, "results": []}
\`\`\`

GET requests should not mutate database state. Query parameters (\`?q=hello\`) come from function parameters not in the path. FastAPI coerces types—\`item_id: int\` rejects non-numeric paths with **422 Unprocessable Entity**.

Browsers and \`curl\` can call GET without a request body:

\`\`\`bash
curl http://127.0.0.1:8000/items/1
\`\`\`

Document query parameters in OpenAPI with \`Query(description=...)\` so frontend developers know which filters exist. Remember that boolean query params accept \`true\`/\`false\` strings.

## Recap

- **@app.get** for safe read operations.
- Return dicts/models; FastAPI serializes JSON.
- Use **query parameters** for filters and search.`,
  },

  "your-first-api:returning-json": {
    quickAnswer:
      "Return a dict, list, or Pydantic model from a route; FastAPI encodes it as JSON with the correct Content-Type automatically.",
    description:
      "Return JSON responses from FastAPI path operations using Python dicts and Pydantic models.",
    body: `## Why this matters

APIs communicate in JSON. You rarely hand-build response bytes in FastAPI—understanding automatic serialization prevents surprises when dates, enums, or nested models appear in responses.

## explanation

\`\`\`python
from datetime import datetime
from fastapi import FastAPI

app = FastAPI()

@app.get("/time")
def current_time():
    return {"now": datetime.utcnow().isoformat()}

@app.get("/users")
def list_users():
    return [
        {"id": 1, "name": "Ada"},
        {"id": 2, "name": "Lin"},
    ]
\`\`\`

FastAPI sets \`Content-Type: application/json\` and uses **jsonable_encoder** for types like \`datetime\`. For stricter output, declare a **response_model** Pydantic class later. To return non-JSON, use \`HTMLResponse\` or \`FileResponse\` from Starlette.

If you return a Pydantic model, FastAPI still serializes it—returning \`model_dump()\` manually is usually unnecessary unless you customized serialization modes.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Plain **dict/list** returns become JSON automatically.
- Datetimes and other types are encoded when possible.
- Use **response_model** when you need validated output shapes.`,
  },

  "your-first-api:path-operations": {
    quickAnswer:
      "Path operations are FastAPI's term for a route handler: an HTTP method, a path, and the function that runs when they match.",
    description:
      "Learn what FastAPI means by path operations and how decorators register them on the app.",
    body: `## Why this matters

Official FastAPI docs say "path operation" instead of "route handler" to stress both **path** and **HTTP method**. Understanding that term helps you read documentation and configure OpenAPI metadata per operation.

## explanation

A path operation includes:

1. **Path** — e.g. \`/users/{user_id}\`
2. **Operation** (HTTP method) — GET, POST, PUT, …
3. **Function** — your Python logic
4. **Decorators metadata** — \`tags\`, \`summary\`, \`response_model\`

\`\`\`python
from fastapi import FastAPI

app = FastAPI()

@app.put("/items/{item_id}", tags=["inventory"], summary="Replace an item")
def replace_item(item_id: int, payload: dict):
    return {"item_id": item_id, **payload}
\`\`\`

FastAPI registers each operation in the **OpenAPI schema**, which powers \`/docs\`. Multiple operations can share the same path with different methods (GET vs POST on \`/items\`).

Tags on path operations become sections in \`/docs\`, which helps large APIs stay navigable. Summaries appear as human-readable operation titles.

## Recap

- **Path operation** = method + path + handler function.
- Decorators carry **OpenAPI** metadata.
- Same path can expose different **HTTP methods**.`,
  },

  "your-first-api:api-testing-in-browser": {
    quickAnswer:
      "Open /docs for Swagger UI to send test requests, or use the browser for GET URLs and DevTools Network tab for inspection.",
    description:
      "Test FastAPI endpoints from the browser using interactive docs and simple GET requests.",
    body: `## Why this matters

You do not need Postman on day one. FastAPI ships interactive documentation so you can exercise POST bodies, see validation errors, and share reproducible API trials with teammates.

## explanation

Start the server, then visit **http://127.0.0.1:8000/docs**. Expand an operation, click **Try it out**, fill parameters and JSON body, and **Execute**. The UI shows status code, response body, and curl equivalent.

For simple **GET** endpoints, paste the URL directly in the browser address bar. Use browser DevTools → **Network** to inspect headers and JSON.

\`\`\`python
@app.get("/hello/{name}")
def hello(name: str):
    return {"hello": name}
\`\`\`

Try \`/hello/World\` in the browser. For POST/PUT, prefer \`/docs\` or \`curl\` because browsers alone cannot easily send JSON POSTs without JavaScript.

Share the \`/docs\` URL with QA so they can reproduce requests without installing tools. Export OpenAPI JSON from \`/openapi.json\` for contract tests.

## Recap

- **/docs** is the built-in interactive API tester.
- Browser address bar works for **GET** with path/query params.
- Use Network tab or \`/docs\` to inspect responses.`,
  },

  "http-methods:get": {
    quickAnswer:
      "In FastAPI, @app.get defines a read-only endpoint that retrieves a resource or collection without a request body.",
    description:
      "Use the GET HTTP method in FastAPI for safe, idempotent read operations and resource lookups.",
    body: `## Why this matters

GET is the default mental model for "fetch data." Misusing GET for deletes or updates breaks caching proxies and REST expectations. FastAPI makes GET routes trivial while still validating path and query parameters.

## explanation

\`\`\`python
from fastapi import FastAPI

app = FastAPI()

@app.get("/articles")
def list_articles(limit: int = 10):
    return {"limit": limit, "items": []}

@app.get("/articles/{slug}")
def get_article(slug: str):
    return {"slug": slug, "title": "Example"}
\`\`\`

Properties teams rely on:

- **Safe** — should not change server state
- **Idempotent** — repeated calls have the same effect
- **Cacheable** — CDNs and browsers may cache (use headers to control)

GET should not use a body in practice; pass filters via **query parameters**.

Avoid putting sensitive tokens in query strings for GET—logs and referrer headers may capture them. Prefer headers or POST for sensitive operations.

## Recap

- Register reads with **@app.get**.
- No request body; use **path** and **query** params.
- Keep GET handlers free of side effects.`,
  },

  "http-methods:post": {
    quickAnswer:
      "Use @app.post to create resources or trigger actions; send JSON bodies as Pydantic models or typed parameters.",
    description:
      "Create resources with POST in FastAPI, including JSON request bodies and validation.",
    body: `## Why this matters

POST creates orders, users, and webhook events. FastAPI validates JSON bodies before your function runs, turning malformed input into clear **422** errors instead of silent bugs.

## explanation

\`\`\`python
from pydantic import BaseModel
from fastapi import FastAPI

class ItemCreate(BaseModel):
    name: str
    price: float

app = FastAPI()

@app.post("/items", status_code=201)
def create_item(item: ItemCreate):
    return {"id": 101, **item.model_dump()}
\`\`\`

POST is **not idempotent**—submitting twice may create two rows unless you design idempotency keys. Return **201 Created** for new resources when appropriate. Combine with \`Location\` headers in more complete APIs.

For idempotent creates (same client retry), accept an \`Idempotency-Key\` header in addition to POST semantics—many payment APIs use this pattern.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **@app.post** for creates and non-idempotent actions.
- Accept bodies via **Pydantic models**.
- Prefer **201** status for successful resource creation.`,
  },

  "http-methods:put": {
    quickAnswer:
      "PUT replaces an entire resource at a URL; in FastAPI use @app.put with a full resource body model.",
    description:
      "Implement full resource replacement with PUT and understand when to prefer PATCH instead.",
    body: `## Why this matters

Clients use PUT when they send the **complete** new representation of a resource. Partial updates belong on PATCH. Mixing them confuses API consumers and breaks idempotent update semantics.

## explanation

\`\`\`python
from pydantic import BaseModel
from fastapi import FastAPI

class User(BaseModel):
    email: str
    name: str

app = FastAPI()

@app.put("/users/{user_id}")
def replace_user(user_id: int, user: User):
    return {"user_id": user_id, **user.model_dump()}
\`\`\`

PUT should be **idempotent**—calling it twice with the same body leaves the resource in the same state. Missing fields in the body often mean "clear this field" in a full replacement model, unlike PATCH.

Document which fields are required on PUT so clients know whether null clears a column or is rejected by validation.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **@app.put** replaces the **whole** resource.
- Send a complete **Pydantic** model in the body.
- PUT is **idempotent**; design URLs with stable resource IDs.`,
  },

  "http-methods:patch": {
    quickAnswer:
      "PATCH applies partial updates; use optional fields in Pydantic models or dedicated Patch schemas with @app.patch.",
    description:
      "Update only some fields of a resource using PATCH in FastAPI.",
    body: `## Why this matters

Mobile apps and forms often change one or two fields. PATCH avoids forcing clients to download and resend entire objects, reducing bandwidth and merge conflicts.

## explanation

\`\`\`python
from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI

class UserPatch(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None

app = FastAPI()

@app.patch("/users/{user_id}")
def patch_user(user_id: int, patch: UserPatch):
    data = patch.model_dump(exclude_unset=True)
    return {"user_id": user_id, "updated": data}
\`\`\`

\`exclude_unset=True\` returns only fields the client actually sent—critical for partial updates. Document which fields are patchable in OpenAPI descriptions.

Consider separate \`UserPatch\` models per role if some fields are admin-only—do not reuse one patch schema for every privilege level.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **@app.patch** for **partial** updates.
- Use **Optional** fields and \`exclude_unset\`.
- Do not use PATCH when you intend full replacement—use **PUT**.`,
  },

  "http-methods:delete": {
    quickAnswer:
      "DELETE removes a resource; define with @app.delete, return 204 No Content or a small confirmation JSON.",
    description:
      "Remove resources with DELETE endpoints and appropriate HTTP status codes in FastAPI.",
    body: `## Why this matters

Clear delete semantics prevent accidental data loss and help clients refresh UI state. REST clients expect DELETE on resource URLs, not GET with a ?delete=true query hack.

## explanation

\`\`\`python
from fastapi import FastAPI, Response

app = FastAPI()
FAKE_DB = {1: {"name": "Widget"}}

@app.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int):
    FAKE_DB.pop(item_id, None)
    return Response(status_code=204)

@app.delete("/items/{item_id}/verbose")
def delete_item_verbose(item_id: int):
    FAKE_DB.pop(item_id, None)
    return {"deleted": item_id}
\`\`\`

DELETE should be **idempotent**—deleting twice should not error explosively (many APIs return 404 on second delete, others return 204). Pick a team convention and document it.

Soft deletes (marking \`deleted_at\`) still often use DELETE or PATCH depending on API style—be explicit in docs.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **@app.delete** removes a resource by ID.
- **204 No Content** is a common success response.
- Keep deletes **idempotent** where possible.`,
  },

  "http-methods:options": {
    quickAnswer:
      "OPTIONS requests describe allowed methods on a URL; FastAPI and Starlette answer CORS preflight OPTIONS automatically when CORSMiddleware is configured.",
    description:
      "Understand OPTIONS requests, CORS preflight, and how FastAPI handles them.",
    body: `## Why this matters

Browsers send **OPTIONS** preflight requests before cross-origin POST with custom headers. If OPTIONS fails, your React app sees a CORS error even when POST would have worked. Knowing OPTIONS separates backend bugs from frontend origin issues.

## explanation

For same-origin GET, you rarely think about OPTIONS. Cross-origin SPAs trigger **preflight**: the browser asks which methods and headers are allowed.

\`\`\`python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
\`\`\`

Starlette responds to OPTIONS with allowed methods. You seldom define \`@app.options\` manually unless building custom protocol behavior.

When debugging CORS, read the browser console preflight error first—it names the missing header or method.

Log preflight failures at debug level during frontend integration—they often reveal a missing Allow-Headers entry before you change application code.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **OPTIONS** supports **CORS preflight** in browsers.
- Configure **CORSMiddleware** for cross-origin frontends.
- Manual OPTIONS handlers are uncommon in FastAPI apps.`,
  },

  "http-methods:head": {
    quickAnswer:
      "HEAD is like GET without a response body; FastAPI supports @app.head for metadata-only checks such as existence or content length.",
    description:
      "Use the HEAD HTTP method to fetch headers and metadata without downloading a response body.",
    body: `## Why this matters

Health checks and CDNs sometimes use HEAD to verify a URL exists with minimal bandwidth. Supporting HEAD on important GET resources improves compatibility with monitors and caches.

## explanation

\`\`\`python
from fastapi import FastAPI, Response

app = FastAPI()

@app.get("/reports/latest")
def get_report():
    return {"size": 12000, "data": "..."}

@app.head("/reports/latest")
def head_report():
    return Response(headers={"Content-Length": "12000"})
\`\`\`

Many frameworks auto-derive HEAD from GET; in FastAPI you may declare **@app.head** explicitly when you need custom headers without a body. HEAD must not return a message body per HTTP spec.

Monitoring tools may HEAD \`/health\` frequently—keep the handler lightweight and avoid database hits when possible.

Pair HEAD with ETag or Last-Modified headers when clients cache large static metadata without downloading bodies.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **HEAD** checks resources **without a body**.
- Useful for **health checks** and cache validators.
- Often mirrors **GET** paths with header-only responses.`,
  },

  "route-parameters:path-parameters": {
    quickAnswer:
      "Declare path variables in the URL with {name} and matching function parameters; FastAPI extracts and validates them.",
    description:
      "Capture values from the URL path using FastAPI path parameters and type conversion.",
    body: `## Why this matters

Path parameters identify **which** resource you want—user 42 versus user 7. Getting extraction and typing right prevents security issues from stringly-typed IDs and produces accurate OpenAPI docs.

## explanation

\`\`\`python
from fastapi import FastAPI

app = FastAPI()

@app.get("/users/{user_id}")
def read_user(user_id: int):
    return {"user_id": user_id}

@app.get("/files/{folder}/{filename}")
def read_file(folder: str, filename: str):
    return {"path": f"{folder}/{filename}"}
\`\`\`

Order matters when paths overlap: declare **static** segments before dynamic ones if needed. FastAPI converts \`user_id\` to \`int\`; invalid values return **422** with validation details—better than manual \`int()\` try/except in every route.

Use \`Path(..., ge=1)\` when IDs must be positive integers to reject zero or negative values at the edge.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Use \`{param}\` in the path and the **same name** in the function.
- Add **type annotations** for automatic validation.
- Static path segments should be ordered to avoid shadowing.`,
  },

  "route-parameters:query-parameters": {
    quickAnswer:
      "Function parameters not in the path become query parameters, e.g. /items?skip=0&limit=10 from skip and limit arguments.",
    description:
      "Read optional and required query string parameters in FastAPI path operations.",
    body: `## Why this matters

Pagination, filtering, and sorting live in query strings. FastAPI maps them to typed Python parameters so clients get clear validation errors instead of silent string coercion bugs.

## explanation

\`\`\`python
from fastapi import FastAPI

app = FastAPI()

@app.get("/items")
def list_items(skip: int = 0, limit: int = 10, q: str | None = None):
    return {"skip": skip, "limit": limit, "q": q}
\`\`\`

Call: \`/items?skip=20&limit=5&q=pen\`

- Parameters with defaults are optional query params.
- Parameters without defaults are **required** query params.
- Use \`Query()\` for validation (min/max, regex) and OpenAPI metadata.

\`\`\`python
from fastapi import Query

@app.get("/search")
def search(q: str = Query(min_length=2)):
    return {"q": q}
\`\`\`

Repeated query keys (\`?tag=a&tag=b\`) need \`list[str]\` annotations or explicit \`Query\` configuration—defaults differ from single values.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Non-path parameters become **query** parameters.
- Defaults make parameters **optional**.
- Use **Query()** for advanced validation and docs.`,
  },

  "route-parameters:optional-parameters": {
    quickAnswer:
      "Mark parameters optional with a default of None or use Optional[str]; combine path, query, and body rules carefully.",
    description:
      "Define optional path and query parameters in FastAPI without breaking validation.",
    body: `## Why this matters

Real APIs rarely require every filter. Optional parameters keep clients simple while still allowing strict validation when a value is provided.

## explanation

\`\`\`python
from typing import Optional
from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/products")
def list_products(
    category: Optional[str] = None,
    in_stock: bool = False,
    max_price: Optional[float] = Query(default=None, ge=0),
):
    return {
        "category": category,
        "in_stock": in_stock,
        "max_price": max_price,
    }
\`\`\`

**Optional query**: default \`None\` or use \`Optional[T]\`. **Required query**: no default. Path parameters cannot be optional in the URL—if you need optional IDs, use query strings or separate routes.

Boolean query params treat absent values as the default; document whether \`?flag=false\` is required to turn a feature off.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Defaults (\`None\`) make query parameters **optional**.
- **Query()** adds constraints when values are present.
- Path segments are always **required** in the URL pattern.`,
  },

  "route-parameters:default-values": {
    quickAnswer:
      "Python default values on parameters define optional query fields and appear as defaults in the OpenAPI schema.",
    description:
      "Set default values for FastAPI parameters to control optional query behavior and documentation.",
    body: `## Why this matters

Defaults document the API contract: pagination size, sort order, and feature flags. They also define what happens when a client omits a parameter entirely.

## explanation

\`\`\`python
from fastapi import FastAPI

app = FastAPI()

@app.get("/events")
def list_events(page: int = 1, page_size: int = 20, sort: str = "date"):
    return {"page": page, "page_size": page_size, "sort": sort}
\`\`\`

If the client calls \`/events\` with no query string, FastAPI passes \`page=1\`, \`page_size=20\`, \`sort="date"\`. Mutable defaults (lists, dicts) are dangerous in plain Python—prefer immutable defaults or \`Query(default_factory=list)\` patterns when needed.

Use \`Query(default=...)\` when you need validation separate from the Python default display in docs.

Changing a default is a backward-compatible change for optional params, but clients may rely on old defaults—note changes in changelog.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Parameter **defaults** imply optional query arguments.
- Defaults show in **OpenAPI** as schema defaults.
- Avoid mutable **list/dict** literals as defaults.`,
  },

  "route-parameters:type-validation": {
    quickAnswer:
      "FastAPI uses parameter type hints to parse and validate path, query, and body data before your route function executes.",
    description:
      "Leverage Python type hints for automatic request validation in FastAPI.",
    body: `## Why this matters

Without validation, \`user_id\` might be the string "admin" or SQL injection payloads in unexpected places. Central validation keeps handlers focused on business logic and returns consistent **422** errors.

## explanation

\`\`\`python
from fastapi import FastAPI
from datetime import date

app = FastAPI()

@app.get("/reports/{day}")
def report(day: date):
    return {"day": day.isoformat()}

@app.get("/scores")
def scores(min_score: float = 0.0, max_score: float = 100.0):
    return {"min_score": min_score, "max_score": max_score}
\`\`\`

Supported conversions include \`int\`, \`float\`, \`bool\`, \`UUID\`, enums, and Pydantic models for bodies. Failed validation returns JSON details:

\`\`\`json
{"detail":[{"loc":["path","day"],"msg":"invalid date", "type":"date_from_datetime_parsing"}]}
\`\`\`

Use \`Annotated\` with \`Path\`/\`Query\` in modern FastAPI style when you need metadata plus types in one declaration.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **Type hints** drive parsing and validation.
- Invalid input → **422 Unprocessable Entity**.
- Combine with **Query/Path** constraints for tighter rules.`,
  },

  "route-parameters:enum-parameters": {
    quickAnswer:
      "Use a Python Enum as a parameter type so FastAPI only allows documented literal values in path or query strings.",
    description:
      "Restrict parameters to a fixed set of allowed values using Enums in FastAPI.",
    body: `## Why this matters

Free-text status filters lead to typos and security gaps. Enums document allowed values in OpenAPI and reject invalid input before it hits your database layer.

## explanation

\`\`\`python
from enum import Enum
from fastapi import FastAPI

class Status(str, Enum):
    draft = "draft"
    published = "published"
    archived = "archived"

app = FastAPI()

@app.get("/posts")
def list_posts(status: Status = Status.draft):
    return {"status": status.value}

@app.get("/priority/{level}")
def priority(level: Status):
    return {"level": level}
\`\`\`

Subclass \`str, Enum\` so JSON serialization uses string values. Clients pass \`?status=published\` or path segments matching enum values; invalid values get **422** with allowed options listed.

OpenAPI renders enums as dropdowns—rename enum members carefully because external clients depend on string values.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **Enum** parameters restrict inputs to known values.
- \`class MyEnum(str, Enum)\` works well with JSON APIs.
- OpenAPI shows an **dropdown** of allowed values in /docs.`,
  },

  "request-body:sending-json-data": {
    quickAnswer:
      "Clients send JSON with Content-Type: application/json; FastAPI maps the body to a Pydantic model parameter in your route.",
    description:
      "Accept JSON request bodies in FastAPI and understand how clients should format POST and PUT data.",
    body: `## Why this matters

Most modern APIs speak JSON. Knowing how clients should send bodies—and how FastAPI parses them—prevents empty-body bugs and charset issues during integration.

## explanation

Client example:

\`\`\`bash
curl -X POST http://127.0.0.1:8000/items \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Notebook", "price": 4.5}'
\`\`\`

Server:

\`\`\`python
from pydantic import BaseModel
from fastapi import FastAPI

class Item(BaseModel):
    name: str
    price: float

app = FastAPI()

@app.post("/items")
def create_item(item: Item):
    return item
\`\`\`

FastAPI reads the body once, validates against \`Item\`, and passes a model instance. Invalid JSON types or missing required fields return **422** with field-level errors.

Ensure clients set UTF-8 JSON for international text; FastAPI decodes Unicode strings into Python \`str\` correctly when the body is valid JSON.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Clients use **application/json** bodies.
- Declare a **Pydantic model** parameter for the body.
- Validation errors are automatic **422** responses.`,
  },

  "request-body:reading-request-body": {
    quickAnswer:
      "Declare a Pydantic BaseModel (or list of models) as a parameter without a default to read and validate the JSON request body.",
    description:
      "Read JSON request bodies in FastAPI path operations using Pydantic models.",
    body: `## Why this matters

Manual \`await request.json()\` scatters validation and skips OpenAPI generation. The FastAPI body parameter pattern keeps one source of truth for shape and types.

## explanation

\`\`\`python
from pydantic import BaseModel, Field
from fastapi import FastAPI

class Signup(BaseModel):
    email: str
    password: str = Field(min_length=8)

app = FastAPI()

@app.post("/signup")
def signup(data: Signup):
    return {"email": data.email, "created": True}
\`\`\`

Access fields via \`data.email\`. For multiple content types, use \`Body()\` or dedicated dependencies. Raw body access is possible via \`Request\` but loses automatic validation—prefer models unless streaming uploads.

For webhooks with custom signatures, you may read raw bytes via \`Request\` in middleware while still using models in routes—keep validation as close to the edge as possible.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Body = **Pydantic parameter** with no \`Path\`/\`Query\`.
- Use **Field()** for extra constraints.
- Prefer models over manual **request.json()**.`,
  },

  "request-body:validation": {
    quickAnswer:
      "Pydantic validates request bodies against your model: required fields, types, lengths, and custom validators before the route runs.",
    description:
      "Understand automatic request body validation and error responses in FastAPI.",
    body: `## Why this matters

Invalid data should fail at the boundary, not deep in SQL or business rules. FastAPI plus Pydantic centralize validation so every endpoint shares the same error format.

## explanation

\`\`\`python
from pydantic import BaseModel, Field, field_validator
from fastapi import FastAPI

class Product(BaseModel):
    sku: str = Field(pattern=r"^[A-Z]{3}-\d{4}$")
    price: float = Field(gt=0)

    @field_validator("sku")
    @classmethod
    def uppercase_sku(cls, v: str) -> str:
        return v.upper()

app = FastAPI()

@app.post("/products")
def create_product(product: Product):
    return product
\`\`\`

Failures return **422** with \`loc\`, \`msg\`, and \`type\` per field—ideal for frontends to highlight form errors. Validation runs **before** your function body executes.

Return business-rule failures with \`HTTPException(400)\` when input is syntactically valid but not allowed (duplicate email), reserving 422 for schema violations.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **Pydantic** enforces types and constraints on bodies.
- Use **Field** and **validators** for business rules.
- Clients receive structured **422** error details.`,
  },

  "request-body:nested-data": {
    quickAnswer:
      "Nest Pydantic models inside other models to represent JSON objects with child objects and lists.",
    description:
      "Model nested JSON structures in FastAPI request bodies using composed Pydantic classes.",
    body: `## Why this matters

Real payloads include addresses, line items, and metadata objects. Flattening everything into top-level fields does not scale; nested models mirror client JSON and database structures.

## explanation

\`\`\`python
from pydantic import BaseModel
from fastapi import FastAPI

class Address(BaseModel):
    city: str
    country: str

class Order(BaseModel):
    customer: str
    shipping: Address
    items: list[str]

app = FastAPI()

@app.post("/orders")
def create_order(order: Order):
    return {
        "customer": order.customer,
        "city": order.shipping.city,
        "count": len(order.items),
    }
\`\`\`

Validation runs recursively—an invalid \`shipping.city\` fails with a nested \`loc\` path like \`["body","shipping","city"]\`. You can reuse \`Address\` in multiple request and response models.

Version nested objects carefully: adding optional nested fields is usually safe; renaming nested keys breaks mobile apps silently.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Compose **nested BaseModel** classes.
- Lists and dicts use standard typing (\`list[str]\`, etc.).
- Errors include **nested field paths** in 422 responses.`,
  },

  "request-body:optional-fields": {
    quickAnswer:
      "Use Optional types or default values on Pydantic model fields so clients may omit keys in JSON bodies.",
    description:
      "Define optional fields in JSON request bodies with Pydantic and FastAPI.",
    body: `## Why this matters

Create and update flows often differ: only some fields are sent on PATCH-like creates. Optional fields with clear defaults prevent forcing clients to send null placeholders everywhere.

## explanation

\`\`\`python
from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI

class ProfileUpdate(BaseModel):
    bio: Optional[str] = None
    website: Optional[str] = None
    newsletter: bool = False

app = FastAPI()

@app.patch("/profile")
def update_profile(body: ProfileUpdate):
    data = body.model_dump(exclude_unset=True)
    return {"applied": data}
\`\`\`

**Optional** with \`None\` default means the field may be omitted. Distinguish "omit" vs "set to null" carefully—Pydantic v2 can treat them differently depending on model config. Document behavior for API consumers.

For PATCH, document whether \`null\` clears a field or is ignored—Pydantic model configuration controls that behavior.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **Optional[T] = None** marks optional JSON fields.
- Use \`exclude_unset\` for partial updates.
- Document **null vs omitted** semantics for clients.`,
  },

  "request-body:multiple-body-parameters": {
    quickAnswer:
      "FastAPI allows only one body parameter per route by default; use a single Pydantic model or embed fields with Body() for advanced cases.",
    description:
      "Handle multiple logical body values in FastAPI using one model or explicit Body parameters.",
    body: `## Why this matters

Beginners often try two body models on one route and hit confusing errors. The HTTP spec has one JSON body; FastAPI encodes that rule while offering escape hatches for form-like multi-part cases.

## explanation

Preferred: **one model** containing everything.

\`\`\`python
from pydantic import BaseModel
from fastapi import FastAPI

class Item(BaseModel):
    name: str

class Metadata(BaseModel):
    source: str

class ItemWithMeta(BaseModel):
    item: Item
    meta: Metadata

app = FastAPI()

@app.post("/combined")
def combined(payload: ItemWithMeta):
    return payload
\`\`\`

For rare cases (e.g. embedding + file), combine **File**, **Form**, and **Body** explicitly per docs. Two pure JSON bodies on one request are not standard—merge schemas instead.

Multipart forms mix files and fields—use \`UploadFile\` plus \`Form()\` rather than trying to attach two JSON documents.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- One route → typically **one JSON body model**.
- **Compose** nested models instead of two body params.
- Files/forms use **multipart**, not double JSON bodies.`,
  },

  "pydantic-basics:what-is-pydantic": {
    quickAnswer:
      "Pydantic is a Python library that validates data using type hints and raises clear errors when values are wrong or missing.",
    description:
      "Learn what Pydantic does and why FastAPI relies on it for request and response schemas.",
    body: `## Why this matters

FastAPI's speed and safety come largely from Pydantic. Understanding it separately from FastAPI helps you debug validation, design schemas, and reuse models in CLI tools or background workers.

## explanation

**Pydantic v2** parses input (dicts, JSON, environment variables) into Python objects and ensures types match annotations. Invalid data raises **ValidationError** with structured details—FastAPI converts those to HTTP **422**.

\`\`\`python
from pydantic import BaseModel, ValidationError

class Pet(BaseModel):
    name: str
    age: int

try:
    Pet(name="Milo", age="young")
except ValidationError as e:
    print(e.errors())
\`\`\`

FastAPI uses Pydantic for **request bodies**, **response models**, **settings**, and **dependency** return types. The same model can generate JSON Schema for OpenAPI automatically.

Pydantic also powers settings via \`pydantic-settings\`, sharing the same validation mindset for environment variables.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **Pydantic** validates data with **type hints**.
- Validation errors are structured and field-specific.
- FastAPI builds **OpenAPI** from Pydantic models.`,
  },

  "pydantic-basics:creating-models": {
    quickAnswer:
      "Subclass BaseModel and annotate fields with types; instantiate with keyword arguments or model_validate from dicts.",
    description:
      "Create Pydantic BaseModel classes for structured API data in FastAPI projects.",
    body: `## Why this matters

Models are the contract between your API and clients. Well-named fields and types appear in generated docs and catch integration mistakes early.

## explanation

\`\`\`python
from pydantic import BaseModel, Field

class Book(BaseModel):
    title: str
    author: str
    pages: int = Field(gt=0)

book = Book(title="Clean Code", author="Martin", pages=464)
data = {"title": "Dune", "author": "Herbert", "pages": 412}
book2 = Book.model_validate(data)
\`\`\`

Models are immutable by default in common usage patterns; use \`model_copy(update={...})\` to derive variants. In FastAPI, use separate models for **create** vs **read** when passwords or internal IDs differ.

Add \`model_config = ConfigDict(str_strip_whitespace=True)\` when user input should not preserve leading spaces in names or emails.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Inherit from **BaseModel** and annotate fields.
- Construct with **kwargs** or **model_validate(dict)**.
- Split **input/output** models when shapes differ.`,
  },

  "pydantic-basics:data-validation": {
    quickAnswer:
      "Pydantic coerces compatible types and rejects invalid data with ValidationError listing each field problem.",
    description:
      "See how Pydantic validates and coerces data used by FastAPI endpoints.",
    body: `## Why this matters

Validation is more than "is it a string?"—ranges, formats, and cross-field rules belong in models so every entry point shares the same rules.

## explanation

\`\`\`python
from pydantic import BaseModel, Field, EmailStr

class Account(BaseModel):
    email: EmailStr
    age: int = Field(ge=13, le=120)

account = Account.model_validate({"email": "user@example.com", "age": "25"})
print(account.age, type(account.age))  # 25, int
\`\`\`

Coercion turns \`"25"\` into \`25\` when safe. Impossible coercions fail. In FastAPI, failed body validation never calls your route—clients always get predictable **422** JSON.

Validation runs at import time only for type checking—runtime validation happens on each \`model_validate\` call.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Pydantic **coerces** when reasonable, else errors.
- Use **Field** and types like **EmailStr** for formats.
- FastAPI surfaces validation as **HTTP 422**.`,
  },

  "pydantic-basics:default-values": {
    quickAnswer:
      "Set defaults on Pydantic fields with = value; optional fields often use Optional[T] = None.",
    description:
      "Add default and optional field values to Pydantic models used in FastAPI.",
    body: `## Why this matters

Defaults document API behavior when clients omit fields and simplify partial-update models. They must be chosen carefully so "missing" and "explicit default" match your product rules.

## explanation

\`\`\`python
from typing import Optional
from pydantic import BaseModel

class Task(BaseModel):
    title: str
    done: bool = False
    priority: int = 1
    assignee: Optional[str] = None

task = Task(title="Ship API")
print(task.done)  # False
\`\`\`

Factory defaults for mutable objects use \`Field(default_factory=list)\`. In request bodies, defaults apply when the key is missing; combine with \`model_dump(exclude_unset=True)\` on updates.

Distinguish \`Field(default=0)\` from \`default_factory\` when the default must be computed per instance.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Field defaults use **= value** in the model.
- **Optional** + \`None\` for nullable optional fields.
- Use **default_factory** for lists and dicts.`,
  },

  "pydantic-basics:field-types": {
    quickAnswer:
      "Pydantic supports str, int, float, bool, dates, UUIDs, enums, HttpUrl, and nested models as field types.",
    description:
      "Use common Pydantic field types for rich validation in FastAPI schemas.",
    body: `## Why this matters

Choosing precise types generates better OpenAPI docs and blocks bad input—URLs that are not URLs, negative IDs, or wrong datetime formats.

## explanation

\`\`\`python
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, HttpUrl

class Event(BaseModel):
    id: UUID
    name: str
    starts_at: datetime
    docs: HttpUrl | None = None

event = Event.model_validate({
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Launch",
    "starts_at": "2026-05-28T10:00:00Z",
    "docs": "https://example.com",
})
\`\`\`

Import specialized types from \`pydantic\` or \`pydantic.types\`. FastAPI reflects these in \`/docs\` so clients know expected formats.

Install \`email-validator\` when using \`EmailStr\` in production projects—FastAPI docs assume it for email fields.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Use **UUID**, **datetime**, **HttpUrl** where appropriate.
- Types improve **validation** and **OpenAPI** schemas.
- Combine with **Field** for numeric bounds and strings length.`,
  },

  "pydantic-basics:nested-models": {
    quickAnswer:
      "Place one BaseModel inside another to validate nested JSON objects and lists of sub-objects.",
    description:
      "Structure complex API payloads with nested Pydantic models in FastAPI.",
    body: `## Why this matters

Nested models match how clients send JSON and how ORMs return related rows. One validation pass covers the entire tree.

## explanation

\`\`\`python
from pydantic import BaseModel

class LineItem(BaseModel):
    sku: str
    qty: int

class Invoice(BaseModel):
    customer_id: int
    lines: list[LineItem]

invoice = Invoice.model_validate({
    "customer_id": 9,
    "lines": [{"sku": "A1", "qty": 2}, {"sku": "B2", "qty": 1}],
})
print(invoice.lines[0].sku)
\`\`\`

Reuse small models across endpoints. For optional nested objects, use \`Optional[Address] = None\`.

Deeply nested trees can produce long error paths—flatten DTOs when mobile clients struggle to parse 422 responses. When lists may be empty, default to \`[]\` with \`Field(default_factory=list)\` so clients always see an array key.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Embed models as **fields** for nested JSON.
- **list[SubModel]** validates arrays of objects.
- Reuse shared sub-models across routes.`,
  },

  "pydantic-basics:model-inheritance": {
    quickAnswer:
      "Subclass Pydantic models to share fields—e.g. UserBase with UserCreate adding a password and UserPublic hiding secrets.",
    description:
      "Reuse fields across Pydantic models with inheritance in FastAPI APIs.",
    body: `## Why this matters

Duplicated field lists drift apart. Inheritance keeps shared columns in sync while specialized models expose only safe fields in responses.

## explanation

\`\`\`python
from pydantic import BaseModel

class UserBase(BaseModel):
    email: str
    full_name: str

class UserCreate(UserBase):
    password: str

class UserPublic(UserBase):
    id: int

class UserInDB(UserPublic):
    hashed_password: str
\`\`\`

FastAPI pattern: **UserCreate** for POST bodies, **UserPublic** as \`response_model\`, **UserInDB** internal only. Python MRO applies; override fields carefully when child classes change types.

Avoid deep inheritance chains that hide fields; two levels (base + variant) is usually enough for APIs. When a child model overrides a field type, run tests to ensure OpenAPI still documents the public shape correctly.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **Base models** hold shared fields.
- Separate **create**, **public**, and **DB** shapes.
- Pair with FastAPI **response_model** to filter output.`,
  },

  "pydantic-basics:serialization": {
    quickAnswer:
      "Serialize models to JSON-compatible dicts with model_dump() and rebuild models from dicts with model_validate().",
    description:
      "Convert Pydantic models to and from JSON-friendly data in FastAPI workflows.",
    body: `## Why this matters

Databases, caches, and message queues need dicts or JSON—not raw model objects. Serialization settings control aliases, excluded fields, and datetime formats.

## explanation

\`\`\`python
from pydantic import BaseModel, Field

class Config(BaseModel):
    model_config = {"populate_by_name": True}
    debug: bool = Field(alias="DEBUG")

payload = Config.model_validate({"DEBUG": True})
print(payload.model_dump())           # python names
print(payload.model_dump(by_alias=True))  # DEBUG key
\`\`\`

FastAPI uses serialization for **responses** when you set \`response_model\`. Use \`model_dump(mode="json")\` before writing to JSON-only stores.

Use \`model_dump(exclude_none=True)\` when building cache keys so optional nulls do not bust deduplication. For APIs returning ORM rows, enable \`from_attributes=True\` in model config so serialization reads attributes instead of dict keys.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **model_dump()** → dict for storage or logging.
- **model_validate()** → model from dict/JSON.
- Control **aliases** and modes for external systems.`,
  },

  "pydantic-basics:dict-model_dump": {
    quickAnswer:
      "Pydantic v2 uses model_dump() instead of dict(); use model_dump_json() for a JSON string.",
    description:
      "Migrate from Pydantic v1 dict() to v2 model_dump() in FastAPI projects.",
    body: `## Why this matters

Tutorials and older Stack Overflow answers still show \`.dict()\`. Pydantic v2 renamed serialization methods; using the wrong call fails in new FastAPI installs.

## explanation

| Pydantic v1   | Pydantic v2        |
|---------------|--------------------|
| \`.dict()\`    | \`.model_dump()\`  |
| \`.json()\`   | \`.model_dump_json()\` |

\`\`\`python
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    price: float

item = Item(name="Pen", price=1.5)
print(item.model_dump())
print(item.model_dump(exclude={"price"}))
print(item.model_dump_json())
\`\`\`

In FastAPI route handlers, returning a model directly still works—framework handles encoding. Use \`model_dump()\` when you need a plain dict for \`INSERT\` queries or manual JSON.

Third-party libraries expecting dicts (Celery, some ORMs) integrate cleanly via \`model_dump()\` at boundaries.

When migrating v1 code, search the repo for .dict( and .json( and replace systematically—mixed APIs confuse reviewers.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Prefer **model_dump()** and **model_dump_json()** in v2.
- **exclude** / **include** filter exported keys.
- FastAPI responses can still return **model instances** directly.`,
  },

  "response-models:response-validation": {
    quickAnswer:
      "Set response_model=YourSchema on a route so FastAPI validates and filters the outgoing JSON to match the schema.",
    description:
      "Validate API responses with response_model in FastAPI for consistent output shapes.",
    body: `## Why this matters

Databases return extra columns—password hashes, internal flags. Response validation strips fields that should never reach clients and catches accidental leaks during development.

## explanation

\`\`\`python
from pydantic import BaseModel
from fastapi import FastAPI

class UserOut(BaseModel):
    id: int
    username: str

app = FastAPI()

@app.get("/users/{user_id}", response_model=UserOut)
def get_user(user_id: int):
    return {
        "id": user_id,
        "username": "ada",
        "password_hash": "secret",  # dropped from response
    }
\`\`\`

FastAPI serializes through \`UserOut\`, excluding fields not in the schema. Use \`response_model=list[UserOut]\` for collections. Validation failures in responses surface as server errors during development—fix before production.

During tests, assert response JSON against \`UserOut.model_validate(data)\` to catch regressions when handlers return extra keys.

Response validation adds a small CPU cost; skip it only on hot paths where you have other guarantees and measure first.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **response_model** enforces output shape.
- Extra keys are **filtered out** by default.
- Apply to **lists** with \`list[Model]\` syntax.`,
  },

  "response-models:hiding-sensitive-fields": {
    quickAnswer:
      "Never put secrets in response models; use separate UserInDB and UserPublic models so only safe fields are declared on response_model.",
    description:
      "Hide passwords and internal fields from API responses using Pydantic response models.",
    body: `## Why this matters

One forgotten field in a dict return can expose tokens or emails. Separate public schemas are a simple, reviewable defense—especially with auto-generated OpenAPI examples.

## explanation

\`\`\`python
from pydantic import BaseModel
from fastapi import FastAPI

class UserInDB(BaseModel):
    id: int
    email: str
    hashed_password: str

class UserPublic(BaseModel):
    id: int
    email: str

def fetch_user(user_id: int) -> UserInDB:
    return UserInDB(id=user_id, email="a@x.com", hashed_password="...")

app = FastAPI()

@app.get("/users/{user_id}", response_model=UserPublic)
def read_user(user_id: int):
    user = fetch_user(user_id)
    return user  # filtered to UserPublic fields
\`\`\`

Alternatively use \`model_config = ConfigDict(from_attributes=True)\` with ORM objects. Never document secrets in OpenAPI—keep them off response models entirely.

Review OpenAPI after changes—examples sometimes reveal field names even when responses filter values.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Use **separate models** for DB vs API output.
- **response_model** filters sensitive attributes.
- Do not rely on manual dict deletion alone.`,
  },

  "response-models:custom-responses": {
    quickAnswer:
      "Return a Starlette Response subclass or use responses={} on the decorator for non-JSON, redirects, and file downloads.",
    description:
      "Send non-JSON and custom HTTP responses from FastAPI when JSON models are not enough.",
    body: `## Why this matters

Not every endpoint returns JSON—CSV exports, HTML pages, and empty 204 bodies need explicit response types. Documenting them keeps clients and proxies from misinterpreting content.

## explanation

\`\`\`python
from fastapi import FastAPI
from fastapi.responses import HTMLResponse, PlainTextResponse, JSONResponse

app = FastAPI()

@app.get("/health.html", response_class=HTMLResponse)
def health_html():
    return "<h1>OK</h1>"

@app.get("/export")
def export():
    return PlainTextResponse("id,name\\n1,Ada", media_type="text/csv")

@app.get("/custom")
def custom():
    return JSONResponse(content={"ok": True}, status_code=200, headers={"X-Trace": "abc"})
\`\`\`

Declare \`responses={404: {"description": "Missing"}}\` on decorators to enrich OpenAPI for multiple status types.

Set \`media_type\` explicitly when clients expect \`text/csv\` or \`application/pdf\` so browsers offer the right download behavior. Streaming large files with \`StreamingResponse\` avoids loading entire blobs into memory on small servers.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Use **Response** subclasses for HTML, files, plain text.
- **JSONResponse** for manual status/headers.
- Document alternate statuses in **responses={}**.`,
  },

  "response-models:response-schemas": {
    quickAnswer:
      "response_model and response_model_by_alias control the OpenAPI response schema and serialized field names clients see.",
    description:
      "Shape OpenAPI response schemas with response_model and related FastAPI options.",
    body: `## Why this matters

Frontend teams generate TypeScript from OpenAPI. Accurate response schemas prevent drift between documented fields and real JSON keys—especially with aliases and unions.

## explanation

\`\`\`python
from pydantic import BaseModel, Field
from fastapi import FastAPI

class ProductOut(BaseModel):
    model_config = {"populate_by_name": True}
    product_name: str = Field(alias="productName")

app = FastAPI()

@app.get(
    "/products/{pid}",
    response_model=ProductOut,
    response_model_by_alias=True,
)
def get_product(pid: int):
    return ProductOut(product_name="Pen")
\`\`\`

OpenAPI lists **ProductOut** with camelCase when \`by_alias=True\`. For union responses, advanced patterns use \`Union\` types or separate status-specific models in \`responses\`.

If you rename response fields with aliases, update client SDKs and integration tests together.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **response_model** drives OpenAPI **response** section.
- **response_model_by_alias** controls exported JSON keys.
- Keep public schemas stable for **client codegen**.`,
  },

  "response-models:status-codes": {
    quickAnswer:
      "Pass status_code=201 (or other codes) to the decorator; combine with response_model for documented success bodies.",
    description:
      "Set HTTP status codes on FastAPI responses alongside response models.",
    body: `## Why this matters

REST clients rely on status codes for branching logic—201 for created, 204 for empty success, 404 for missing. Decorating with the right code documents intent in OpenAPI.

## explanation

\`\`\`python
from fastapi import FastAPI, status
from pydantic import BaseModel

class ItemOut(BaseModel):
    id: int
    name: str

app = FastAPI()

@app.post(
    "/items",
    response_model=ItemOut,
    status_code=status.HTTP_201_CREATED,
)
def create_item(name: str):
    return ItemOut(id=1, name=name)
\`\`\`

For errors, raise \`HTTPException(status_code=404)\`. Dynamic statuses can use \`JSONResponse(status_code=...)\` when the code depends on business rules.

Some proxies cache only GET—do not rely on status alone without \`Cache-Control\` headers where appropriate.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Declare success codes with **status_code** on the route.
- Use **status.HTTP_* constants** for clarity.
- Pair codes with **response_model** when returning a body.`,
  },

  "response-models:response-examples": {
    quickAnswer:
      "Add openapi_examples or responses with example payloads on routes so /docs shows realistic sample JSON.",
    description:
      "Document example API responses in FastAPI OpenAPI and Swagger UI.",
    body: `## Why this matters

Examples teach integrators faster than raw schemas alone. They appear in Swagger UI and exported OpenAPI for mock servers and contract tests.

## explanation

\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    price: float

app = FastAPI()

@app.post(
    "/items",
    response_model=Item,
    responses={
        201: {
            "description": "Created item",
            "content": {
                "application/json": {
                    "example": {"name": "Pen", "price": 1.5}
                }
            },
        }
    },
)
def create_item(item: Item):
    return item
\`\`\`

Pydantic v2 \`json_schema_extra\` on models can embed examples for all uses of a schema. Keep examples in sync when fields change.

Examples should use realistic values (valid emails, ISO dates) so mock servers behave like production.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Use **responses** dict for per-status examples.
- Model-level **json_schema_extra** for reusable examples.
- Examples improve **/docs** and client onboarding.`,
  },

  "status-codes:common-http-status-codes": {
    quickAnswer:
      "Know 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Validation Error, and 500 Server Error for REST APIs.",
    description:
      "Learn common HTTP status codes used in FastAPI REST APIs and when to return each.",
    body: `## Why this matters

Status codes are the API's body language. Using them consistently lets clients, caches, and monitors behave correctly without parsing error message strings.

## explanation

| Code | Meaning | Typical FastAPI use |
|------|---------|-------------------|
| 200 | OK | Successful GET/PUT/PATCH |
| 201 | Created | Successful POST creating a resource |
| 204 | No Content | Successful DELETE with empty body |
| 400 | Bad Request | Malformed client request (rare; prefer 422 for validation) |
| 401 | Unauthorized | Missing/invalid auth |
| 403 | Forbidden | Auth ok but not allowed |
| 404 | Not Found | Resource missing |
| 422 | Unprocessable Entity | Pydantic validation failure (automatic) |
| 500 | Server Error | Unhandled exception |

\`\`\`python
from fastapi import FastAPI, HTTPException

app = FastAPI()

@app.get("/items/{item_id}")
def read_item(item_id: int):
    if item_id == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"id": item_id}
\`\`\`

Monitoring tools alert on 5xx rates; product analytics track 4xx ratios to spot broken clients or validation mismatches after releases.

## Recap

- **2xx** success, **4xx** client issues, **5xx** server faults.
- FastAPI auto-uses **422** for validation errors.
- Raise **HTTPException** for intentional 4xx responses.`,
  },

  "status-codes:returning-custom-status-codes": {
    quickAnswer:
      "Set status_code on the decorator for fixed successes, or return JSONResponse/Response with a dynamic status_code from business logic.",
    description:
      "Return specific HTTP status codes from FastAPI routes beyond the default 200.",
    body: `## Why this matters

Created vs accepted vs no-content success all use different codes. Expressing the right code helps clients distinguish "saved" from "queued" without custom envelope wrappers.

## explanation

\`\`\`python
from fastapi import FastAPI, status
from fastapi.responses import JSONResponse

app = FastAPI()

@app.post("/jobs", status_code=status.HTTP_202_ACCEPTED)
def enqueue_job():
    return {"status": "queued"}

@app.post("/validate")
def validate_only(ok: bool):
    if ok:
        return JSONResponse({"valid": True}, status_code=200)
    return JSONResponse({"valid": False}, status_code=409)
\`\`\`

Import constants from \`starlette.status\` or \`fastapi.status\` for readability. Document non-default codes in OpenAPI via \`responses\`.

When returning 204, omit a response body entirely—some clients choke on \`{}\` with 204. Document accepted and conflict responses (202 vs 200 vs 409) in OpenAPI when workflows branch on business rules.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Fixed codes: **status_code** on decorator.
- Dynamic codes: **JSONResponse(status_code=...)**.
- Use named **HTTP_* constants** instead of magic numbers.`,
  },

  "status-codes:error-responses": {
    quickAnswer:
      "Raise HTTPException for expected errors; register exception handlers for consistent JSON error bodies across the app.",
    description:
      "Return structured error responses from FastAPI using HTTPException and exception handlers.",
    body: `## Why this matters

Ad-hoc \`return {"error": "..."}\` with status 200 confuses clients. Standard error shapes and status codes make debugging and frontend error handling predictable.

## explanation

\`\`\`python
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/accounts/{aid}")
def get_account(aid: int):
    raise HTTPException(status_code=404, detail="Account not found")

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail},
    )
\`\`\`

Validation errors already return \`{"detail": [...]}\`. Extend handlers for custom domain exceptions (\`AppError\`) to map to 409 or 402 consistently.

Log server-side details for 500 errors but return generic messages to clients to avoid leaking stack traces.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **HTTPException** for expected failures.
- **exception_handler** for unified error JSON.
- Keep **422** validation format for input errors.`,
  },

  "status-codes:rest-conventions": {
    quickAnswer:
      "Map POST to create (201), GET to read (200), PUT/PATCH to update (200), DELETE to remove (204), and use nouns in URLs—not verbs.",
    description:
      "Follow REST conventions for URLs, methods, and status codes in FastAPI APIs.",
    body: `## Why this matters

Consistent REST style reduces debate on every endpoint and lets generic tools (caches, API gateways) behave correctly. It also matches what new hires expect from other JSON APIs.

## explanation

**Resources as nouns**: \`/users/{id}\`, not \`/getUser\`. **Methods express action**: GET read, POST create, PUT replace, PATCH partial update, DELETE remove.

\`\`\`python
from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/{user_id}")
def read_user(user_id: int): ...

@router.post("/", status_code=201)
def create_user(): ...

@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int): ...
\`\`\`

Use plural collections (\`/items\`). Filter with query params (\`?status=active\`). Version in path (\`/v1/...\`) when breaking changes ship.

Hypermedia (HATEOAS) is optional—if you include \`links\` objects, keep them consistent on collection and item responses.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **Nouns** in paths; **HTTP methods** for actions.
- Align **status codes** with operation outcome.
- **Plural** resource names and **query** filters.`,
  },

  "dependency-injection:what-dependencies-are": {
    quickAnswer:
      "Dependencies are reusable callables FastAPI runs before your route to provide shared values like DB sessions, settings, or the current user.",
    description:
      "Understand FastAPI dependency injection and how it keeps routes thin and testable.",
    body: `## Why this matters

Without dependencies, every route duplicates database setup, auth checks, and pagination logic. Injection centralizes that code and makes unit tests swap fakes via overrides.

## explanation

A **dependency** is any callable FastAPI resolves via \`Depends\`. It can depend on other dependencies, forming a graph resolved per request.

\`\`\`python
from fastapi import Depends, FastAPI

def common_parameters(q: str | None = None, skip: int = 0, limit: int = 10):
    return {"q": q, "skip": skip, "limit": limit}

app = FastAPI()

@app.get("/items")
def list_items(commons: dict = Depends(common_parameters)):
    return commons
\`\`\`

Dependencies run **before** the path operation. Use them for auth, DB sessions, rate limits, and configuration—not for heavy unrelated business logic.

Dependencies can also decorate router-level \`dependencies=[Depends(...)]\` to protect entire modules without repeating parameters.

## Recap

- Dependencies are **shared callables** injected with **Depends**.
- They can **chain**—dependencies may depend on dependencies.
- Keep path functions focused on **HTTP-specific orchestration**.`,
  },

  "dependency-injection:depends": {
    quickAnswer:
      "Wrap a callable in Depends() and add it as a parameter; FastAPI calls it and passes the return value to your route.",
    description:
      "Use FastAPI Depends() to declare and wire dependencies into path operations.",
    body: `## Why this matters

\`Depends()\` is the syntax that activates injection. Mastering it unlocks database sessions per request, optional auth, and test overrides—core patterns in production FastAPI codebases.

## explanation

\`\`\`python
from fastapi import Depends, FastAPI, Header, HTTPException

async def verify_token(x_token: str = Header()):
    if x_token != "secret-token":
        raise HTTPException(status_code=401)
    return x_token

app = FastAPI()

@app.get("/secure")
def secure_route(token: str = Depends(verify_token)):
    return {"token_ok": True}
\`\`\`

Use \`Depends()\` even when you do not need the return value—side effects like auth checks still run. For classes, Depends can target \`__call__\` or methods. In tests, \`app.dependency_overrides[verify_token] = lambda: "test"\` replaces implementations.

Type-annotate dependency results (\`user: User = Depends(get_current_user)\`) so editors understand available attributes.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **Depends(callable)** declares an injected parameter.
- Dependencies may **raise HTTPException** to stop the request.
- **dependency_overrides** simplify tests.`,
  },

  "dependency-injection:shared-logic": {
    quickAnswer:
      "Extract repeated query parsing, auth, and pagination into dependency functions and reuse them across routes with Depends.",
    description:
      "Share common logic across FastAPI endpoints using dependency functions.",
    body: `## Why this matters

Copy-pasted pagination limits drift between teams. One dependency function enforces the same max \`limit\` and logging on every list endpoint.

## explanation

\`\`\`python
from fastapi import Depends, Query, FastAPI

def pagination(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    return {"skip": skip, "limit": limit}

app = FastAPI()

@app.get("/orders")
def list_orders(page: dict = Depends(pagination)):
    return {"page": page, "orders": []}

@app.get("/invoices")
def list_invoices(page: dict = Depends(pagination)):
    return {"page": page, "invoices": []}
\`\`\`

Shared auth, feature flags, and locale detection fit the same pattern. Keep dependencies **pure enough** to test without HTTP when possible.

If two dependencies need the same expensive setup, nest them so work runs once per request graph.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- Move repeated setup into **dependency functions**.
- Reuse with **Depends** on many routes.
- Centralize **limits and auth** rules.`,
  },

  "dependency-injection:reusable-components": {
    quickAnswer:
      "Package dependencies in classes or APIRouter modules; use callable classes and settings dependencies for larger apps.",
    description:
      "Build reusable dependency components for FastAPI routers and services.",
    body: `## Why this matters

As apps grow, flat functions in \`main.py\` become unwieldy. Reusable components—settings providers, repository factories—keep routers readable and mirror service-oriented architecture.

## explanation

\`\`\`python
from fastapi import Depends, FastAPI

class Paginator:
    def __init__(self, max_limit: int = 100):
        self.max_limit = max_limit

    def __call__(self, limit: int = 20):
        return min(limit, self.max_limit)

app = FastAPI()
paginate = Paginator(max_limit=50)

@app.get("/items")
def items(cap: int = Depends(paginate)):
    return {"limit": cap}
\`\`\`

Combine with **APIRouter** so each module exports \`router\` plus local dependencies. Settings from environment variables often live in a cached \`get_settings()\` dependency.

Export dependency callables from \`dependencies.py\` to avoid circular imports between routers and models.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **Callable classes** encapsulate configurable dependencies.
- Colocate dependencies with **routers** or domain packages.
- **get_settings()** pattern for config injection.`,
  },

  "dependency-injection:injecting-database-sessions": {
    quickAnswer:
      "Yield a database session in a dependency and close it in a finally block so each request gets one session without leaks.",
    description:
      "Provide SQLAlchemy or similar database sessions per request using FastAPI dependencies.",
    body: `## Why this matters

Sharing one global session across requests is unsafe. Per-request sessions scope transactions, prevent connection leaks, and make testing straightforward with in-memory databases.

## explanation

\`\`\`python
from collections.abc import Generator
from fastapi import Depends, FastAPI

# Illustrative — wire to your SessionLocal
def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()

@app.get("/users/{user_id}")
def read_user(user_id: int, db=Depends(get_db)):
    return db.query(User).filter(User.id == user_id).first()
\`\`\`

Use \`yield\` so cleanup runs after the response. In async SQLAlchemy, use async sessions and \`async def get_db()\`. Do not commit inside the dependency unless that is your team's pattern—many routes commit explicitly.

For read-only endpoints, consider \`readonly\` session configuration if your ORM supports it to reduce lock contention.

In tests, override get_db to use a transaction rolled back after each test for fast isolation without dropping tables.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **yield** session in dependency; **close** in \`finally\`.
- One **session per request** via Depends.
- Match **sync/async** style to your ORM setup.`,
  },

  "dependency-injection:injecting-authentication": {
    quickAnswer:
      "Create a get_current_user dependency that validates JWT or session tokens and inject it into protected routes with Depends.",
    description:
      "Inject authenticated user objects into FastAPI routes using security dependencies.",
    body: `## Why this matters

Auth must run before business logic on protected routes. A single \`get_current_user\` dependency enforces authentication consistently and keeps handlers free of token parsing boilerplate.

## explanation

\`\`\`python
from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    user = decode_and_lookup(token)  # your auth logic
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

app = FastAPI()

@app.get("/me")
def read_me(current_user=Depends(get_current_user)):
    return {"username": current_user.username}
\`\`\`

Layer **roles** with another dependency that depends on \`get_current_user\`. FastAPI's security utilities integrate with OpenAPI "Authorize" in \`/docs\`.

Combine with \`Security\` scopes when integrating OAuth2 scopes—FastAPI documents required scopes per route.

Practice this topic in /docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI.

## Recap

- **OAuth2PasswordBearer** + **get_current_user** pattern.
- Raise **401** when credentials fail.
- Stack dependencies for **role-based** access.`,
  },
};
