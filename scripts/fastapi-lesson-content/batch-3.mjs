import { py, bash, h2, h3, mdx, p, ul, callout } from "./core.mjs";

/** @param {string} quickAnswer @param {string} description @param {string} body */
function L(quickAnswer, description, body) {
  return { quickAnswer, description, body };
}

export const LESSONS = {
  // ── 21. Static Files ──────────────────────────────────────────────────────

  "static-files:serving-css": L(
    "Mount a StaticFiles directory and link stylesheets from `/static` so FastAPI serves CSS without a separate web server.",
    "Serve CSS files from a FastAPI app using StaticFiles and HTML link tags — folder layout and URL paths explained.",
    mdx(
      h2("Why this matters"),
      p(
        "APIs often return JSON, but dashboards, login pages, and admin panels need styled HTML. Serving CSS from the same app keeps deployment simple: one process, one domain, no CORS headaches for assets.",
      ),
      h2("Mount static files"),
      py(`from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")`),
      p(
        "Place `styles.css` in `static/styles.css`. Browsers request `/static/styles.css` after you reference it in HTML.",
      ),
      h3("Link CSS in HTML"),
      p("In a template or returned HTML string:"),
      "```html\n<link rel=\"stylesheet\" href=\"/static/styles.css\" />\n```",
      callout(
        "tip",
        "Use `/static/...` paths (leading slash) so links work from nested routes like `/users/42`.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Create a `static/` folder for CSS",
        "Mount with `StaticFiles` at a URL prefix such as `/static`",
        "Reference assets with `<link href=\"/static/...\">`",
      ]),
    ),
  ),

  "static-files:serving-javascript": L(
    "Serve `.js` files from a mounted static directory; use `/static/...` script tags and avoid executing untrusted uploads as scripts.",
    "How to serve JavaScript with FastAPI StaticFiles — client scripts, caching, and safe file placement.",
    mdx(
      h2("Why this matters"),
      p(
        "Front-end code needs JavaScript for interactivity—toggles, fetch calls to your API, form validation. FastAPI can host those files alongside your routes so you do not need Nginx only for a `app.js` file.",
      ),
      h2("Serve JS from static"),
      py(`app.mount("/static", StaticFiles(directory="static"), name="static")`),
      p("Save `static/app.js` and load it at the bottom of HTML:"),
      "```html\n<script src=\"/static/app.js\" defer></script>\n```",
      p(
        "The `defer` attribute downloads the script in parallel and runs it after HTML parses—good default for page scripts.",
      ),
      h3("Calling your API"),
      "```javascript\nasync function loadUsers() {\n  const res = await fetch(\"/users\");\n  const data = await res.json();\n  console.log(data);\n}\n```",
      callout(
        "warning",
        "Never let users upload `.js` into your static folder. User uploads belong in a separate storage path with strict content types.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Put client JS under `static/`",
        "Load with `<script src=\"/static/...\">`",
        "Use `fetch` to talk to FastAPI JSON endpoints",
      ]),
    ),
  ),

  "static-files:serving-images": L(
    "Store images in a static directory or return `FileResponse` for dynamic paths; set correct media types for browsers.",
    "Serve images in FastAPI — logos, favicons, and FileResponse for files outside the static mount.",
    mdx(
      h2("Why this matters"),
      p(
        "Product photos, avatars, and icons are part of most web apps. Images are binary files—served efficiently from disk with correct `Content-Type` headers so browsers render them instead of downloading unknown data.",
      ),
      h2("Static images"),
      p("Place `logo.png` in `static/images/logo.png` and reference:"),
      "```html\n<img src=\"/static/images/logo.png\" alt=\"Logo\" width=\"120\" />\n```",
      h2("Dynamic file responses"),
      p("When the path depends on a database ID, return a file explicitly:"),
      py(`from fastapi.responses import FileResponse

@app.get("/avatars/{user_id}")
def avatar(user_id: int):
    path = f"uploads/{user_id}.jpg"
    return FileResponse(path, media_type="image/jpeg")`),
      callout(
        "tip",
        "Validate that `path` stays inside `uploads/`—never pass raw user input into file paths (path traversal).",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Public images → `static/` + `<img src=\"/static/...\">`",
        "Per-user files → `FileResponse` with safe path checks",
        "Set `media_type` when it is not inferred",
      ]),
    ),
  ),

  "static-files:static-folders": L(
    "Organize `static/css`, `static/js`, and `static/images`; mount once at `/static` and keep upload directories separate from public assets.",
    "FastAPI static folder structure — naming conventions, mount order, and separating public assets from uploads.",
    mdx(
      h2("Why this matters"),
      p(
        "A clear folder layout prevents mixing public assets with private uploads. Teams can find files quickly, and deployment scripts know exactly what to sync to a CDN.",
      ),
      h2("Recommended layout"),
      bash(`myapp/
  main.py
  static/
    css/
    js/
    images/
  templates/
  uploads/   # not mounted publicly`),
      h2("Mount once"),
      py(`app.mount("/static", StaticFiles(directory="static"), name="static")`),
      p(
        "Mount **after** API routes are defined, or use `APIRouter` so `/static` does not shadow dynamic paths like `/users/me`. Starlette matches more specific routes first when registered in order—document your team's convention.",
      ),
      h3("Production tip"),
      p(
        "In production, many teams serve `/static` from a CDN (S3 + CloudFront) while FastAPI handles API traffic. The same folder structure still applies locally.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "One `static/` tree for public CSS, JS, images",
        "Keep `uploads/` outside the public mount",
        "Mount `StaticFiles` at a single URL prefix",
      ]),
    ),
  ),

  // ── 22. Templates ─────────────────────────────────────────────────────────

  "templates:jinja2-templates": L(
    "Install Jinja2, point FastAPI's Jinja2Templates at a `templates/` folder, and use `.html` files with `{{ }}` placeholders for HTML pages.",
    "Jinja2 templates in FastAPI — setup, template syntax, and when to use server-rendered HTML vs JSON APIs.",
    mdx(
      h2("Why this matters"),
      p(
        "JSON APIs power SPAs, but many apps still need HTML: emails preview, admin panels, or simple multi-page sites. Jinja2 is a mature template engine that keeps logic minimal in views and markup in `.html` files.",
      ),
      h2("Setup"),
      bash("pip install jinja2"),
      py(`from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates

app = FastAPI()
templates = Jinja2Templates(directory="templates")`),
      p("Create `templates/home.html`:"),
      "```html\n<h1>Hello, {{ name }}!</h1>\n```",
      callout(
        "tip",
        "Use templates for HTML; keep JSON endpoints on separate routes for mobile apps and front-end frameworks.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Jinja2 renders `.html` with variables",
        "`Jinja2Templates(directory=\"templates\")` is the FastAPI helper",
        "Separate template routes from JSON API routes when both exist",
      ]),
    ),
  ),

  "templates:rendering-html": L(
    "Return `templates.TemplateResponse(request, \"page.html\", context)` from a route so FastAPI sends rendered HTML with the correct content type.",
    "Render HTML pages in FastAPI with TemplateResponse — request object, context dict, and status codes.",
    mdx(
      h2("Why this matters"),
      p(
        "Returning raw HTML strings does not scale—templates give reuse (layouts), escaping, and includes. `TemplateResponse` integrates Jinja2 with FastAPI's request lifecycle and middleware.",
      ),
      h2("Render a page"),
      py(`@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse(
        request,
        "home.html",
        {"name": "World"},
    )`),
      p(
        "Always pass `request`—it is required for URL generation and some Starlette internals. The third argument is the template context dict.",
      ),
      h3("Status codes"),
      py(`return templates.TemplateResponse(
    request, "error.html", {"code": 404}, status_code=404
)`),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Use `TemplateResponse(request, template_name, context)`",
        "Import `Request` and include it in the route",
        "Optional `status_code` for error pages",
      ]),
    ),
  ),

  "templates:passing-data-to-templates": L(
    "Pass plain dicts (or Pydantic `.model_dump()`) into TemplateResponse; use dot notation in templates for nested data and keep heavy logic out of HTML.",
    "Pass data from FastAPI routes into Jinja2 templates — context variables, loops, and safe display.",
    mdx(
      h2("Why this matters"),
      p(
        "Templates display data from your database or API—user names, lists of products, flash messages. The route gathers data; the template formats it. That split keeps Python logic testable and HTML readable.",
      ),
      h2("Context dict"),
      py(`@app.get("/users")
def user_list(request: Request, db: Session = Depends(get_db)):
    users = db.query(User).all()
    return templates.TemplateResponse(
        request,
        "users.html",
        {"users": users, "title": "All users"},
    )`),
      p("In `users.html`:"),
      "```html\n{% for user in users %}\n  <li>{{ user.email }}</li>\n{% endfor %}\n```",
      callout(
        "tip",
        "Jinja2 auto-escapes HTML in `{{ }}` by default—reducing XSS risk when showing user-generated text.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Context keys become template variables",
        "Use `{% for %}` and `{% if %}` in Jinja2",
        "Prefer `.model_dump()` for Pydantic models in context",
      ]),
    ),
  ),

  "templates:dynamic-pages": L(
    "Use path parameters in routes, load records in Python, and render one template file for many URLs—return 404 when the record is missing.",
    "Build dynamic HTML pages in FastAPI — detail views, shared layouts, and 404 handling with Jinja2.",
    mdx(
      h2("Why this matters"),
      p(
        "A blog post at `/posts/42` and `/posts/99` shares one template—the ID changes, the layout stays the same. Dynamic pages are how server-rendered apps avoid duplicating HTML per record.",
      ),
      h2("Detail route"),
      py(`@app.get("/posts/{post_id}")
def post_detail(request: Request, post_id: int, db: Session = Depends(get_db)):
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return templates.TemplateResponse(
        request, "post_detail.html", {"post": post}
    )`),
      h3("Base layout"),
      p(
        "Use Jinja2 inheritance: `base.html` defines blocks; child templates `{% extend %}` and fill `{% block content %}`. One layout update refreshes every page.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Path params select which row to load",
        "Raise `HTTPException(404)` when data is missing",
        "Use template inheritance for shared chrome",
      ]),
    ),
  ),

  // ── 23. Database Basics ───────────────────────────────────────────────────

  "database-basics:why-databases-matter": L(
    "Databases persist data across restarts, enforce structure with schemas, and let many clients query safely—unlike in-memory dicts in a single process.",
    "Why FastAPI apps use databases — persistence, concurrency, queries, and when files or memory are enough.",
    mdx(
      h2("Why this matters"),
      p(
        "A todo list stored in a Python dict disappears when the server restarts and breaks when you run two workers. Real users, orders, and sessions need durable storage that survives deploys and scales beyond one machine's RAM.",
      ),
      h2("What databases provide"),
      ul([
        "**Persistence** — data survives crashes and redeploys",
        "**Structured queries** — find users by email without scanning every row in code",
        "**Concurrency** — many requests read/write safely with transactions",
        "**Integrity** — foreign keys and unique constraints catch bad data early",
      ]),
      p(
        "FastAPI does not include a database—you choose PostgreSQL, SQLite, MySQL, or others and connect with SQLAlchemy, SQLModel, or async drivers.",
      ),
      callout(
        "tip",
        "Start with SQLite for learning; use PostgreSQL for production APIs with multiple workers.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "In-memory storage is fine for demos, not production state",
        "Databases add persistence, queries, and safe concurrent access",
        "FastAPI pairs with any database via libraries you install",
      ]),
    ),
  ),

  "database-basics:sql-vs-nosql": L(
    "SQL databases use tables and SQL for relational data; NoSQL stores documents, key-value, or graphs—pick based on query patterns, not hype.",
    "SQL vs NoSQL for FastAPI backends — relational Postgres vs MongoDB-style document stores and trade-offs.",
    mdx(
      h2("Why this matters"),
      p(
        "Choosing a database affects how you model users, orders, and logs. The wrong choice means painful migrations or awkward joins. Most FastAPI tutorials use SQL (PostgreSQL/SQLite) because ORMs like SQLAlchemy fit naturally.",
      ),
      h2("SQL (relational)"),
      p(
        "Tables with rows and columns, linked by foreign keys. Great when data is structured and you need transactions, reports, and JOIN queries. Examples: PostgreSQL, MySQL, SQLite.",
      ),
      h2("NoSQL"),
      p(
        "Document stores (MongoDB) fit flexible JSON-like records. Key-value (Redis) fits caches and sessions. Graph DBs fit social networks. Schema flexibility helps prototypes; constraints are often enforced in application code.",
      ),
      callout(
        "tip",
        "Many production FastAPI apps use PostgreSQL for core data and Redis for caching—hybrid stacks are normal.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "SQL = tables, schemas, JOINs, strong consistency",
        "NoSQL = flexible shapes; choose by access patterns",
        "Default learning path: SQL + SQLAlchemy/SQLModel",
      ]),
    ),
  ),

  "database-basics:connecting-databases": L(
    "Create a SQLAlchemy engine from a DATABASE_URL, use session dependencies per request, and call `create_all` in dev or Alembic in production.",
    "Connect FastAPI to a database — connection strings, engines, sessions, and dependency injection pattern.",
    mdx(
      h2("Why this matters"),
      p(
        "Connecting correctly means one pool of connections shared across requests, sessions closed after each request, and no leaked connections under load. FastAPI's `Depends()` makes that pattern repeatable.",
      ),
      h2("Connection string"),
      py(`DATABASE_URL = "postgresql+psycopg2://user:pass@localhost/appdb"
# SQLite example:
# sqlite:///./app.db

engine = create_engine(DATABASE_URL)`),
      h2("Session per request"),
      py(`SessionLocal = sessionmaker(bind=engine, autoflush=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/items")
def list_items(db: Session = Depends(get_db)):
    return db.query(Item).all()`),
      bash("# Test Postgres is reachable\npsql \"$DATABASE_URL\" -c 'SELECT 1'"),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Engine manages the connection pool",
        "`yield` in `get_db` closes sessions after each request",
        "Inject `db` with `Depends(get_db)` in routes",
      ]),
    ),
  ),

  "database-basics:environment-configuration": L(
    "Store DATABASE_URL in environment variables or a `.env` file; load settings with Pydantic BaseSettings and never commit secrets to git.",
    "Database environment configuration for FastAPI — .env files, secrets, and different URLs per environment.",
    mdx(
      h2("Why this matters"),
      p(
        "Your laptop uses SQLite; staging uses a small Postgres; production uses a managed cluster with SSL. Hard-coding URLs breaks deploys and leaks passwords in git history. Environment-based config is standard.",
      ),
      h2("Settings class"),
      py(`from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "sqlite:///./dev.db"

    class Config:
        env_file = ".env"

settings = Settings()
engine = create_engine(settings.database_url)`),
      bash(`# .env (do not commit)
DATABASE_URL=postgresql+psycopg2://user:pass@db:5432/app`),
      callout(
        "warning",
        "Add `.env` to `.gitignore`. In production, inject variables via your host (Docker, Kubernetes, Railway, etc.).",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "One `DATABASE_URL` per environment",
        "Use Pydantic settings to load and validate config",
        "Never commit real credentials",
      ]),
    ),
  ),

  // ── 24. SQLAlchemy ────────────────────────────────────────────────────────

  "sqlalchemy:orm-concepts": L(
    "An ORM maps Python classes to database tables so you work with objects instead of raw SQL strings—SQLAlchemy is the most common ORM in FastAPI apps.",
    "SQLAlchemy ORM concepts for FastAPI — models, sessions, and how object-oriented database access works.",
    mdx(
      h2("Why this matters"),
      p(
        "Writing SQL by hand for every route is error-prone and hard to refactor. The ORM translates `user.email` into parameterized queries, helps avoid SQL injection, and keeps schema changes in one place (models + migrations).",
      ),
      h2("Core pieces"),
      ul([
        "**Engine** — connection pool to the database",
        "**Session** — unit of work for a request (queries + commits)",
        "**Model class** — Python class ↔ table",
        "**Mapper** — links class attributes to columns",
      ]),
      py(`class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)`),
      p("You query with the session: `db.query(User).filter(User.email == email).first()`."),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "ORM = objects in Python, tables in the database",
        "Session tracks changes until `commit()`",
        "FastAPI injects a session per request",
      ]),
    ),
  ),

  "sqlalchemy:models": L(
    "Declare SQLAlchemy models by subclassing `DeclarativeBase`, defining `__tablename__`, and adding typed `Column` fields that match your schema.",
    "Define SQLAlchemy models in FastAPI projects — columns, types, defaults, and primary keys.",
    mdx(
      h2("Why this matters"),
      p(
        "Models are the contract between your API and the database. Clear types (`String`, `DateTime`, `Boolean`) document fields and help SQLAlchemy generate correct DDL when you migrate.",
      ),
      h2("Example model"),
      py(`from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from datetime import datetime

class Base(DeclarativeBase):
    pass

class Item(Base):
    __tablename__ = "items"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)`),
      p(
        "Modern SQLAlchemy 2.0 style uses `Mapped` and `mapped_column` for better typing in editors.",
      ),
      callout(
        "tip",
        "Keep models in `models.py` or a `models/` package—avoid defining tables inside route functions.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "One class per table with `__tablename__`",
        "Use `Mapped[type]` for typed columns",
        "Share a single `Base` for metadata and migrations",
      ]),
    ),
  ),

  "sqlalchemy:tables": L(
    "Tables are created from model metadata via `Base.metadata.create_all(engine)` in development; production should use Alembic migrations instead.",
    "SQLAlchemy tables and metadata — create_all, reflection, and relationship to migrations.",
    mdx(
      h2("Why this matters"),
      p(
        "A model describes a table, but the database does not change until DDL runs. Understanding metadata helps you bootstrap local databases and know why production needs versioned migrations.",
      ),
      h2("Create tables in dev"),
      py(`from app.database import engine, Base
from app import models  # register models

Base.metadata.create_all(bind=engine)`),
      p(
        "`create_all` only creates missing tables—it does not alter columns on existing tables. That limitation is why Alembic exists.",
      ),
      h3("Inspect metadata"),
      py(`print(Base.metadata.tables.keys())  # ('users', 'items', ...)`),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "All models registered on `Base` share one metadata object",
        "`create_all` is fine for local prototypes",
        "Use Alembic to change schemas in production",
      ]),
    ),
  ),

  "sqlalchemy:sessions": L(
    "Open a SQLAlchemy session per request, pass it via `Depends`, commit on success, rollback on errors, and always close in `finally`.",
    "SQLAlchemy sessions in FastAPI — transactions, commit, rollback, and the request-scoped pattern.",
    mdx(
      h2("Why this matters"),
      p(
        "Sessions cache loaded objects and queue writes. Sharing one global session across requests causes race conditions and stale data. Per-request sessions isolate work and map cleanly to HTTP transactions.",
      ),
      h2("Lifecycle"),
      py(`def get_db():
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()`),
      p(
        "Some teams commit inside route handlers instead of the dependency—pick one style and stay consistent.",
      ),
      callout(
        "warning",
        "Long-running requests hold connections—keep session scope short; use background tasks for slow work.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "One session per request",
        "`commit()` saves changes; `rollback()` undoes on failure",
        "Always `close()` the session",
      ]),
    ),
  ),

  "sqlalchemy:crud-operations": L(
    "Create with `db.add()`, read with `query`/`get`, update by mutating attributes, delete with `db.delete()`—then `commit()` to persist.",
    "SQLAlchemy CRUD in FastAPI routes — add, query, update, delete patterns with sessions.",
    mdx(
      h2("Why this matters"),
      p(
        "CRUD is the backbone of most APIs. ORM CRUD keeps queries parameterized and returns Python objects your Pydantic response models can serialize.",
      ),
      h2("Operations"),
      py(`# Create
item = Item(title="Learn FastAPI")
db.add(item)
db.commit()
db.refresh(item)

# Read
item = db.get(Item, 1)

# Update
item.title = "Updated"
db.commit()

# Delete
db.delete(item)
db.commit()`),
      p("In routes, prefer `db.get(Model, id)` and return 404 if `None`."),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "`add` + `commit` for creates",
        "`get` / `query` for reads",
        "Mutate fields or `delete` then `commit`",
      ]),
    ),
  ),

  "sqlalchemy:relationships": L(
    "Model relationships with `relationship()` and `ForeignKey` express one-to-many and many-to-many links—use `joinedload` to avoid N+1 query problems.",
    "SQLAlchemy relationships for FastAPI — foreign keys, back_populates, and eager loading.",
    mdx(
      h2("Why this matters"),
      p(
        "Users have posts; orders have line items. Relationships let you navigate `user.posts` in Python while the database enforces referential integrity. Without eager loading, listing 100 users might trigger 101 queries.",
      ),
      h2("One-to-many"),
      py(`class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    posts: Mapped[list["Post"]] = relationship(back_populates="owner")

class Post(Base):
    __tablename__ = "posts"
    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    owner: Mapped["User"] = relationship(back_populates="posts")`),
      h3("Eager load"),
      py(`from sqlalchemy.orm import joinedload
users = db.query(User).options(joinedload(User.posts)).all()`),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "`ForeignKey` on the many side",
        "`relationship` + `back_populates` on both models",
        "Use `joinedload`/`selectinload` for performance",
      ]),
    ),
  ),

  "sqlalchemy:migrations": L(
    "Schema changes belong in migration files (Alembic), not manual SQL in production—generate revisions when models change and upgrade each deploy.",
    "SQLAlchemy schema migrations overview — why create_all is not enough and how Alembic fits in.",
    mdx(
      h2("Why this matters"),
      p(
        "Adding a column or index in production without a migration risks downtime and data loss. Migrations are version-controlled scripts that upgrade (and sometimes downgrade) schema safely across teams.",
      ),
      h2("Workflow"),
      ul([
        "Change SQLAlchemy models",
        "Run `alembic revision --autogenerate -m \"add bio\"`",
        "Review the generated script",
        "Run `alembic upgrade head` on deploy",
      ]),
      bash("alembic init alembic\nalembic upgrade head"),
      p(
        "Point Alembic at your model `Base.metadata` so autogenerate detects new columns and tables.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Do not rely on `create_all` after launch",
        "Alembic tracks applied revisions",
        "Always review autogenerated SQL before production",
      ]),
    ),
  ),

  // ── 25. SQLModel ──────────────────────────────────────────────────────────

  "sqlmodel:what-sqlmodel-is": L(
    "SQLModel is a library by the FastAPI author that combines SQLAlchemy tables and Pydantic models in one class definition.",
    "What SQLModel is — one class for database rows and API validation in FastAPI projects.",
    mdx(
      h2("Why this matters"),
      p(
        "Without SQLModel you often duplicate fields: a SQLAlchemy `User` table and a Pydantic `UserRead` schema. SQLModel reduces that duplication while staying compatible with SQLAlchemy and FastAPI.",
      ),
      h2("Hello SQLModel"),
      py(`from sqlmodel import SQLModel, Field

class Hero(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    secret_name: str
    age: int | None = None`),
      p(
        "`table=True` means this class maps to a database table. Fields use Python type hints like Pydantic.",
      ),
      bash("pip install sqlmodel"),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "SQLModel = SQLAlchemy + Pydantic ergonomics",
        "Created for FastAPI-style type hints",
        "Good fit for smaller and medium APIs",
      ]),
    ),
  ),

  "sqlmodel:combining-pydantic-sqlalchemy": L(
    "Use one SQLModel class with `table=True` for storage and sibling models without `table=True` for create/read schemas that hide secrets.",
    "Combine Pydantic and SQLAlchemy with SQLModel — table models, read schemas, and create schemas.",
    mdx(
      h2("Why this matters"),
      p(
        "APIs should not return password hashes. SQLModel lets you share field definitions: a public `HeroPublic` model and a table `Hero` model with overlapping fields, without maintaining two unrelated class hierarchies.",
      ),
      h2("Pattern"),
      py(`class HeroBase(SQLModel):
    name: str
    age: int | None = None

class Hero(HeroBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    secret_name: str

class HeroPublic(HeroBase):
    id: int

class HeroCreate(HeroBase):
    secret_name: str`),
      p(
        "Routes accept `HeroCreate`, save `Hero`, and return `HeroPublic`—sensitive fields never appear in responses.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Base classes share common fields",
        "`table=True` only on the persistence model",
        "Separate create/read models for API safety",
      ]),
    ),
  ),

  "sqlmodel:crud-with-sqlmodel": L(
    "Use SQLModel `Session` with `select()` statements, `session.add()`, `commit()`, and `refresh()`—same flow as SQLAlchemy with cleaner typing.",
    "CRUD operations with SQLModel in FastAPI — Session, select, and route examples.",
    mdx(
      h2("Why this matters"),
      p(
        "SQLModel sessions work like SQLAlchemy 2.0 sessions. You get type-checked queries and FastAPI can inject `Session` the same way, keeping CRUD routes short and readable.",
      ),
      h2("CRUD example"),
      py(`from sqlmodel import Session, select

@app.post("/heroes", response_model=HeroPublic)
def create_hero(hero: HeroCreate, session: Session = Depends(get_session)):
    db_hero = Hero.model_validate(hero)
    session.add(db_hero)
    session.commit()
    session.refresh(db_hero)
    return db_hero

@app.get("/heroes/{hero_id}", response_model=HeroPublic)
def read_hero(hero_id: int, session: Session = Depends(get_session)):
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(404)
    return hero`),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "`Session` + `Depends` per request",
        "`model_validate` builds table rows from input schemas",
        "`select()` for list and filter queries",
      ]),
    ),
  ),

  // ── 26. Alembic Migrations ────────────────────────────────────────────────

  "alembic-migrations:database-migrations": L(
    "Migrations are versioned scripts that change database schema; Alembic tracks which revisions ran so every environment stays in sync.",
    "Database migrations with Alembic in FastAPI — concepts, revision files, and upgrade workflow.",
    mdx(
      h2("Why this matters"),
      p(
        "Deploying code that expects a `bio` column before the column exists causes 500 errors. Migrations apply schema changes in order, on purpose, with a history you can audit and roll back when needed.",
      ),
      h2("Alembic basics"),
      bash(`alembic init alembic
# edit alembic.ini and env.py to point at your models
alembic revision -m "create users"
alembic upgrade head`),
      p(
        "Each revision file has `upgrade()` and `downgrade()` functions. The `alembic_version` table stores the current revision id.",
      ),
      callout(
        "tip",
        "Run migrations as a deploy step before or while new app versions start—not only on developer laptops.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Migrations = ordered schema change scripts",
        "Alembic records the current revision in the DB",
        "`upgrade head` applies pending changes",
      ]),
    ),
  ),

  "alembic-migrations:generating-migrations": L(
    "Run `alembic revision --autogenerate` after model changes, then read the script—autogenerate can miss renames and needs human review.",
    "Generate Alembic migrations from SQLAlchemy/SQLModel models — autogenerate, manual edits, and common pitfalls.",
    mdx(
      h2("Why this matters"),
      p(
        "Hand-writing every `ALTER TABLE` is tedious and easy to mistype. Autogenerate compares your models to the live database and drafts a revision—but it is a helper, not infallible.",
      ),
      h2("Autogenerate"),
      bash("alembic revision --autogenerate -m \"add user bio\""),
      p("Ensure `env.py` imports all models so metadata is complete:"),
      py(`from app.models import Base
target_metadata = Base.metadata`),
      callout(
        "warning",
        "Autogenerate may drop columns it thinks you removed—verify diffs in code review.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Change models first, then autogenerate",
        "Import all models in `env.py`",
        "Always review generated `upgrade()`",
      ]),
    ),
  ),

  "alembic-migrations:upgrading-downgrading-schema": L(
    "Apply schema changes with `alembic upgrade head` and revert with `alembic downgrade -1` or a specific revision id when downgrade functions are safe.",
    "Upgrade and downgrade database schema with Alembic — head, single step, and production caution.",
    mdx(
      h2("Why this matters"),
      p(
        "Rollbacks save you when a deploy goes wrong—if `downgrade()` is written and tested. Upgrades move forward through the chain of revisions; downgrades walk backward one step at a time.",
      ),
      h2("Commands"),
      bash(`alembic upgrade head      # apply all pending
alembic upgrade +1      # one step forward
alembic downgrade -1    # one step back
alembic downgrade base  # all the way down (destructive in prod)`),
      p(
        "In production, prefer forward-only fixes (a new migration) instead of downgrading data-bearing columns unless you have backups.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "`upgrade head` is the usual deploy command",
        "Test downgrades on staging with real-ish data",
        "Forward-fix migrations are often safer than downgrade",
      ]),
    ),
  ),

  "alembic-migrations:version-tracking": L(
    "Alembic stores the current revision in `alembic_version`; use `alembic current` and `alembic history` to see what ran and what is pending.",
    "Alembic version tracking — revision ids, branches, and checking migration state across environments.",
    mdx(
      h2("Why this matters"),
      p(
        "When staging works but production fails, the first question is: are migrations in sync? Version tracking answers which script ran and which environment lags behind.",
      ),
      h2("Inspect state"),
      bash(`alembic current
alembic history --verbose
alembic heads`),
      p(
        "Revision ids look like `a1b2c3d4e5f6`. Each file links `down_revision` to the parent, forming a chain (or branches merged later).",
      ),
      callout(
        "tip",
        "CI can run `alembic upgrade head` against a throwaway database to catch broken migrations before deploy.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "`alembic_version` table stores the active revision",
        "`current` / `history` diagnose drift",
        "Keep migration files in git with application code",
      ]),
    ),
  ),

  // ── 27. CRUD API Development ──────────────────────────────────────────────

  "crud-api-development:create-endpoints": L(
    "POST endpoints accept a Pydantic body, create a database row, return 201 with the created resource, and validate uniqueness before insert.",
    "Build FastAPI create endpoints — POST, request models, 201 status, and database persistence.",
    mdx(
      h2("Why this matters"),
      p(
        "Create is how clients add users, posts, and orders. A well-designed POST validates input, returns the new id, and uses the correct status code so clients and OpenAPI docs behave predictably.",
      ),
      h2("POST route"),
      py(`@app.post("/items", response_model=ItemRead, status_code=201)
def create_item(item_in: ItemCreate, db: Session = Depends(get_db)):
    item = Item(**item_in.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item`),
      p(
        "Use a `ItemCreate` schema without `id` and an `ItemRead` schema for the response. Map conflicts (duplicate email) to 409.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "POST + body model for creates",
        "Return 201 and the created resource",
        "Separate create and read Pydantic models",
      ]),
    ),
  ),

  "crud-api-development:read-endpoints": L(
    "GET list endpoints return collections; GET by id returns one resource or 404—use response_model for stable JSON shape.",
    "FastAPI read endpoints — list routes, detail routes, and HTTP 404 when records are missing.",
    mdx(
      h2("Why this matters"),
      p(
        "Read operations are the most common API calls. Clear URL design (`/items` vs `/items/{id}`) and consistent 404 handling make clients reliable and caches possible for public lists.",
      ),
      h2("List and detail"),
      py(`@app.get("/items", response_model=list[ItemRead])
def list_items(db: Session = Depends(get_db)):
    return db.query(Item).all()

@app.get("/items/{item_id}", response_model=ItemRead)
def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item`),
      callout(
        "tip",
        "Add pagination before returning unbounded lists—see the pagination lesson next in this track.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "GET `/resources` for collections",
        "GET `/resources/{id}` for one row",
        "404 when `db.get` returns None",
      ]),
    ),
  ),

  "crud-api-development:update-endpoints": L(
    "Use PUT for full replacement or PATCH for partial updates; load the row, apply changes, commit, and return the updated model.",
    "FastAPI update endpoints — PUT vs PATCH, partial updates, and returning updated resources.",
    mdx(
      h2("Why this matters"),
      p(
        "Updates must not silently create new rows or change ids. Loading by primary key, applying only allowed fields, and returning the saved row keeps clients and databases aligned.",
      ),
      h2("Partial update (PATCH style)"),
      py(`@app.patch("/items/{item_id}", response_model=ItemRead)
def update_item(
    item_id: int,
    item_in: ItemUpdate,
    db: Session = Depends(get_db),
):
    item = db.get(Item, item_id)
    if not item:
        raise HTTPException(404)
    data = item_in.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item`),
      p(
        "`exclude_unset=True` applies only fields the client sent—ideal for PATCH semantics.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "PATCH + optional fields for partial updates",
        "Verify row exists before mutating",
        "Return the updated resource after `commit`",
      ]),
    ),
  ),

  "crud-api-development:delete-endpoints": L(
    "DELETE `/items/{id}` removes a row and returns 204 No Content, or 404 if the id does not exist—consider soft deletes for audit trails.",
    "FastAPI delete endpoints — HTTP 204, hard delete vs soft delete, and safe confirmation patterns.",
    mdx(
      h2("Why this matters"),
      p(
        "Deletes are destructive. APIs should be explicit: success means gone (204), missing id means 404. Many products use `is_deleted` flags instead of physical deletes to support recovery and compliance.",
      ),
      h2("Hard delete"),
      py(`@app.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.get(Item, item_id)
    if not item:
        raise HTTPException(404)
    db.delete(item)
    db.commit()
    return None`),
      h3("Soft delete"),
      py(`item.is_deleted = True
item.deleted_at = datetime.utcnow()
db.commit()`),
      callout(
        "warning",
        "Protect DELETE routes with authentication and authorization—never leave destructive endpoints public.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "204 No Content is standard for successful DELETE",
        "404 when the resource is already absent",
        "Soft delete when you need history or undo",
      ]),
    ),
  ),

  "crud-api-development:pagination": L(
    "Paginate list endpoints with `limit` and `offset` query parameters—or cursor-based pagination for large, live feeds.",
    "Pagination in FastAPI — limit/offset query params, response metadata, and performance basics.",
    mdx(
      h2("Why this matters"),
      p(
        "Returning ten thousand rows in one JSON response slows databases and browsers. Pagination caps payload size and gives clients a predictable way to walk large datasets.",
      ),
      h2("Limit and offset"),
      py(`@app.get("/items")
def list_items(
    limit: int = Query(20, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    items = db.query(Item).offset(offset).limit(limit).all()
    total = db.query(Item).count()
    return {"items": items, "total": total, "limit": limit, "offset": offset}`),
      p(
        "Document defaults in OpenAPI. For huge tables, offset pagination gets slow—cursor pagination (where `id > last_seen`) scales better.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Use `limit` + `offset` query parameters",
        "Cap `limit` with `le=100`",
        "Return total count when clients need page numbers",
      ]),
    ),
  ),

  "crud-api-development:filtering": L(
    "Expose optional query parameters (status, category, date range) and build SQLAlchemy filters only for provided params.",
    "Filter list endpoints in FastAPI — query parameters, dynamic SQLAlchemy filters, and validation.",
    mdx(
      h2("Why this matters"),
      p(
        "Clients rarely need every row. Filtering by status, owner, or date range reduces bandwidth and database load. Query params keep filters visible in URLs and cache keys.",
      ),
      h2("Dynamic filters"),
      py(`@app.get("/items")
def list_items(
    status: str | None = None,
    owner_id: int | None = None,
    db: Session = Depends(get_db),
):
    q = db.query(Item)
    if status:
        q = q.filter(Item.status == status)
    if owner_id is not None:
        q = q.filter(Item.owner_id == owner_id)
    return q.all()`),
      callout(
        "tip",
        "Validate enums with `Literal` or Pydantic models so invalid `status` values return 422, not empty results.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Optional query params drive filters",
        "Chain `.filter()` on a base query",
        "Validate allowed filter values",
      ]),
    ),
  ),

  "crud-api-development:searching": L(
    "Implement search with `ilike` on indexed columns or dedicated full-text tools (Postgres `tsvector`)—never concatenate raw user input into SQL.",
    "Search in FastAPI APIs — query params, SQL LIKE/ILIKE, and full-text search introduction.",
    mdx(
      h2("Why this matters"),
      p(
        "Search bars send a `q` parameter. Users expect substring matches on titles and emails. Safe search uses bound parameters; advanced search may use Postgres full-text or Elasticsearch.",
      ),
      h2("Simple search"),
      py(`@app.get("/items/search")
def search_items(q: str = Query(min_length=1), db: Session = Depends(get_db)):
    pattern = f"%{q}%"
    return db.query(Item).filter(Item.title.ilike(pattern)).all()`),
      p(
        "SQLAlchemy passes `pattern` as a parameter—avoid f-strings inside raw SQL text. Add indexes on searched columns for speed at scale.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Use a `q` (or `search`) query parameter",
        "`ilike` for case-insensitive substring match",
        "Use full-text or external search for large corpora",
      ]),
    ),
  ),

  // ── 28. Authentication ────────────────────────────────────────────────────

  "authentication:authentication-concepts": L(
    "Authentication proves who the user is (login); authorization decides what they can do—tokens and sessions carry identity between requests.",
    "Authentication concepts for FastAPI — identity, credentials, sessions vs tokens, and separation from authorization.",
    mdx(
      h2("Why this matters"),
      p(
        "Public blogs can stay anonymous; banking APIs cannot. Authentication attaches a verified identity to each request so you can save user-specific data and audit actions.",
      ),
      h2("Common approaches"),
      ul([
        "**Session cookies** — server stores session id; browser sends cookie",
        "**Bearer tokens (JWT)** — signed token in `Authorization` header",
        "**OAuth2** — delegate login to Google/GitHub; your API receives tokens",
      ]),
      p(
        "FastAPI documents OAuth2 with Password and Bearer flows in the official tutorial—start there, then add refresh tokens and hashing.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Authentication = who are you?",
        "Authorization = what may you do?",
        "Pick cookies or JWT based on client type (browser vs mobile)",
      ]),
    ),
  ),

  "authentication:oauth2": L(
    "FastAPI's `OAuth2PasswordBearer` extracts tokens from the Authorization header; OAuth2 providers handle third-party login flows.",
    "OAuth2 in FastAPI — password flow, bearer tokens, and third-party login overview.",
    mdx(
      h2("Why this matters"),
      p(
        "OAuth2 is the industry pattern for APIs and delegated login. FastAPI ships helpers that integrate with OpenAPI security schemes so `/docs` shows the lock icon and Try it out sends tokens correctly.",
      ),
      h2("Password bearer skeleton"),
      py(`from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.get("/users/me")
def read_users_me(token: str = Depends(oauth2_scheme)):
    user = decode_token(token)
    return user`),
      p(
        "Social login (Google, GitHub) uses authorization redirects—libraries like Authlib handle provider specifics while your API still issues its own session or JWT.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "`OAuth2PasswordBearer` for header tokens",
        "`tokenUrl` points to your login/token route",
        "Third-party login builds on OAuth2 redirects",
      ]),
    ),
  ),

  "authentication:password-hashing": L(
    "Never store plain passwords—hash with bcrypt (via passlib) and verify with `verify(plain, hash)` on login.",
    "Password hashing in FastAPI — bcrypt, passlib, and safe storage for user credentials.",
    mdx(
      h2("Why this matters"),
      p(
        "Database leaks happen. Hashed passwords slow attackers; plain text passwords become instant account takeovers. Hashing is one-way—you cannot recover the password, only verify a login attempt.",
      ),
      h2("Hash and verify"),
      py(`from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)`),
      bash("pip install passlib[bcrypt]"),
      callout(
        "warning",
        "Do not invent your own salt or hash algorithm—use bcrypt or argon2 via established libraries.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Store only password hashes",
        "bcrypt via passlib is a common choice",
        "`verify` on login, `hash` on signup/password change",
      ]),
    ),
  ),

  "authentication:jwt-tokens": L(
    "JWTs are signed JSON payloads carrying claims like `sub` (user id) and `exp`; verify signature and expiry on every protected request.",
    "JWT tokens in FastAPI — encode, decode, secret keys, and protecting routes with bearer tokens.",
    mdx(
      h2("Why this matters"),
      p(
        "JWTs let stateless APIs authenticate without server-side session storage—useful for mobile apps and microservices. The trade-off: revocation is harder until tokens expire.",
      ),
      h2("Create and verify"),
      py(`from datetime import datetime, timedelta, timezone
from jose import jwt

SECRET = "change-me-in-env"
ALGO = "HS256"

def create_token(subject: str, minutes: int = 30) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=minutes)
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, SECRET, algorithm=ALGO)

def decode_token(token: str) -> dict:
    return jwt.decode(token, SECRET, algorithms=[ALGO])`),
      bash("pip install python-jose[cryptography]"),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "JWT = header.payload.signature",
        "Include `exp` and verify on each request",
        "Keep `SECRET` in environment variables",
      ]),
    ),
  ),

  "authentication:login-system": L(
    "A login route checks email/password with `verify_password`, then returns a JWT or sets a session cookie—use OAuth2 form fields for password flow.",
    "Build a login system in FastAPI — token endpoint, form data, and returning access tokens.",
    mdx(
      h2("Why this matters"),
      p(
        "Login is the front door. It must rate-limit failures, return generic errors (avoid user enumeration), and issue credentials clients send on later requests.",
      ),
      h2("Token endpoint"),
      py(`from fastapi.security import OAuth2PasswordRequestForm

@app.post("/token")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(401, "Incorrect email or password")
    token = create_token(str(user.id))
    return {"access_token": token, "token_type": "bearer"}`),
      p(
        "Swagger UI uses `username` for the email field—document that for API consumers.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Validate credentials against hashed passwords",
        "Return `access_token` + `token_type`",
        "Use 401 for failed login",
      ]),
    ),
  ),

  "authentication:signup-system": L(
    "Signup validates unique email, hashes the password, saves the user, and optionally returns tokens or requires email verification before login.",
    "User signup in FastAPI — registration endpoint, validation, duplicate email handling, and secure defaults.",
    mdx(
      h2("Why this matters"),
      p(
        "Signup creates identity records. Weak validation invites junk accounts; missing uniqueness checks cause confusing duplicates. Hash passwords before the first commit.",
      ),
      h2("Register route"),
      py(`@app.post("/signup", response_model=UserPublic, status_code=201)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(409, "Email already registered")
    user = User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user`),
      callout(
        "tip",
        "Never return `password` or `hashed_password` in `UserPublic` response models.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Validate input with Pydantic",
        "409 when email exists",
        "Hash password before saving",
      ]),
    ),
  ),

  "authentication:access-tokens": L(
    "Short-lived access tokens authorize API calls; send them as `Authorization: Bearer <token>` and validate in a dependency used by protected routes.",
    "Access tokens in FastAPI — bearer headers, dependency injection, and short expiry for security.",
    mdx(
      h2("Why this matters"),
      p(
        "Access tokens are presented on every API call. Short lifetimes (15–60 minutes) limit damage if a token leaks. Clients refresh or re-login when expired.",
      ),
      h2("Dependency"),
      py(`def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = decode_token(token)
        user_id = int(payload["sub"])
    except Exception:
        raise HTTPException(401, "Invalid token")
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(401)
    return user

@app.get("/me")
def me(user: User = Depends(get_current_user)):
    return user`),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Bearer token in Authorization header",
        "Decode and load user in a dependency",
        "Keep access tokens short-lived",
      ]),
    ),
  ),

  "authentication:refresh-tokens": L(
    "Issue a long-lived refresh token to obtain new access tokens without re-entering passwords—store refresh tokens securely and rotate them on use.",
    "Refresh tokens in FastAPI — token pairs, rotation, and secure storage patterns.",
    mdx(
      h2("Why this matters"),
      p(
        "Short access tokens improve security but annoy users if they must log in hourly. Refresh tokens stay in httpOnly cookies or secure storage and swap for fresh access tokens silently.",
      ),
      h2("Refresh flow"),
      py(`@app.post("/token/refresh")
def refresh(body: RefreshRequest, db: Session = Depends(get_db)):
    record = db.query(RefreshToken).filter_by(token=body.refresh_token, revoked=False).first()
    if not record or record.expires_at < datetime.utcnow():
        raise HTTPException(401)
    access = create_token(str(record.user_id), minutes=30)
    # Optional: rotate refresh token
    return {"access_token": access, "token_type": "bearer"}`),
      callout(
        "warning",
        "Store refresh token hashes in the database so leaks of DB backups do not expose usable tokens.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Access token = frequent API use",
        "Refresh token = get new access token",
        "Rotate and revoke refresh tokens on logout",
      ]),
    ),
  ),

  // ── 29. Authorization ─────────────────────────────────────────────────────

  "authorization:roles": L(
    "Assign users a role such as `member` or `admin` and check `user.role` in dependencies before running privileged logic.",
    "Role-based authorization in FastAPI — role fields, enums, and dependency checks.",
    mdx(
      h2("Why this matters"),
      p(
        "Authentication tells you who logged in; roles group users for coarse permissions. Admins manage settings; members edit only their own content. Roles keep `if` statements out of every route body.",
      ),
      h2("Role check dependency"),
      py(`from enum import Enum

class Role(str, Enum):
    member = "member"
    admin = "admin"

def require_admin(user: User = Depends(get_current_user)):
    if user.role != Role.admin:
        raise HTTPException(403, "Admin only")
    return user

@app.delete("/users/{user_id}")
def delete_user(user_id: int, _: User = Depends(require_admin)):
    ...`),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Store role on the user model",
        "Use dependencies to enforce roles",
        "403 Forbidden when role is insufficient",
      ]),
    ),
  ),

  "authorization:permissions": L(
    "Fine-grained permissions (e.g. `posts:write`) go beyond roles—map users to permission sets and check them in reusable dependencies.",
    "Permissions in FastAPI — RBAC, permission strings, and enforcing action-level access.",
    mdx(
      h2("Why this matters"),
      p(
        "Roles alone break when admins need read-only access or contractors may edit only one module. Permissions name specific actions; roles become bundles of permissions.",
      ),
      h2("Permission dependency factory"),
      py(`def require_permission(permission: str):
    def checker(user: User = Depends(get_current_user)):
        if permission not in user.permissions:
            raise HTTPException(403, "Missing permission")
        return user
    return checker

@app.post("/posts")
def create_post(_: User = Depends(require_permission("posts:write"))):
    ...`),
      p(
        "Load permissions from database tables linking users, roles, and permission rows for flexible admin UIs.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Permissions name actions, not just job titles",
        "Factory dependencies avoid duplicated checks",
        "403 when permission is missing",
      ]),
    ),
  ),

  "authorization:admin-systems": L(
    "Admin routes live under a separate prefix or router, require admin role, audit sensitive actions, and never expose raw user secrets.",
    "Admin systems in FastAPI — separate routers, stricter auth, and operational safety.",
    mdx(
      h2("Why this matters"),
      p(
        "Admin panels delete users, change billing, and view PII. They need stronger guards than public APIs—MFA, IP allowlists, and detailed logs are common in production.",
      ),
      h2("Admin router"),
      py(`admin = APIRouter(prefix="/admin", tags=["admin"])

@admin.get("/users")
def list_users(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    return db.query(User).all()

app.include_router(admin)`),
      callout(
        "tip",
        "Hide admin OpenAPI tags in public docs with environment-based `docs_url=None` or separate internal apps.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Isolate admin routes in a router",
        "Always depend on `require_admin`",
        "Audit destructive operations",
      ]),
    ),
  ),

  "authorization:protected-routes": L(
    "Add `Depends(get_current_user)` to any route that needs login; combine with role or permission dependencies for layered protection.",
    "Protect FastAPI routes — dependencies, optional auth, and consistent 401 vs 403 responses.",
    mdx(
      h2("Why this matters"),
      p(
        "One unprotected DELETE endpoint can wipe data. Dependencies make protection declarative—readers see security requirements in the function signature and OpenAPI schema. Auditors and new teammates spot missing auth faster when it lives in `Depends()` rather than hidden inside route bodies.",
      ),
      h2("Protected vs public"),
      py(`@app.get("/public")
def public():
    return {"ok": True}

@app.get("/private")
def private(user: User = Depends(get_current_user)):
    return {"email": user.email}`),
      p(
        "Return **401** when credentials are missing or invalid; **403** when authenticated but not allowed.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "`Depends(get_current_user)` on private routes",
        "401 = not authenticated",
        "403 = authenticated but forbidden",
      ]),
    ),
  ),

  "authorization:access-control": L(
    "Enforce object-level access: users may edit only their own rows by comparing `resource.owner_id` to `current_user.id`.",
    "Access control in FastAPI — ownership checks, multi-tenant isolation, and policy helpers.",
    mdx(
      h2("Why this matters"),
      p(
        "Being logged in is not enough—user A must not update user B's profile. Object-level checks compare resource ownership (or organization id) to the current user on every mutating route.",
      ),
      h2("Ownership check"),
      py(`@app.patch("/posts/{post_id}")
def update_post(
    post_id: int,
    data: PostUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(404)
    if post.owner_id != user.id:
        raise HTTPException(403)
    ...`),
      p(
        "Centralize rules in a `authorize(user, resource, action)` helper as policies grow.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Check resource owner (or tenant) after load",
        "404 hides existence; 403 when owner mismatch",
        "Extract policy logic as apps grow",
      ]),
    ),
  ),

  // ── 30. Security ──────────────────────────────────────────────────────────

  "security:https": L(
    "Serve APIs over HTTPS in production so tokens and passwords are encrypted in transit—terminate TLS at Nginx or your cloud load balancer.",
    "HTTPS for FastAPI production — TLS termination, redirects, and why HTTP is unsafe for auth.",
    mdx(
      h2("Why this matters"),
      p(
        "HTTP sends headers and bodies in cleartext. Anyone on the network can steal JWTs and session cookies. HTTPS encrypts traffic and helps users trust your domain.",
      ),
      h2("Production setup"),
      ul([
        "Obtain certificates (Let's Encrypt is free)",
        "Terminate TLS at Nginx, Caddy, or a cloud load balancer",
        "Redirect HTTP → HTTPS",
        "Set `Secure` flag on cookies",
      ]),
      bash("# Example: uvicorn behind proxy already handling TLS\nuvicorn app.main:app --host 0.0.0.0 --port 8000"),
      callout(
        "tip",
        "Local development can use HTTP; staging and production should mirror real TLS configuration.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Never send tokens over plain HTTP in production",
        "Terminate TLS at the reverse proxy",
        "Force HTTPS redirects",
      ]),
    ),
  ),

  "security:password-hashing": L(
    "Use slow password hashes (bcrypt/argon2), unique salts per password, and never log or echo passwords—security layer complements auth lessons.",
    "Security-focused password hashing — algorithms, rotation, and compliance considerations beyond basic login.",
    mdx(
      h2("Why this matters"),
      p(
        "Hashing at signup is step one. Security also means upgrading weak legacy hashes on login, blocking breached passwords (Have I Been Pwned APIs), and ensuring logs never capture plaintext passwords from form posts.",
      ),
      h2("Hardening"),
      py(`pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12,
)`),
      ul([
        "Increase work factor as hardware improves",
        "Re-hash when user logs in if parameters changed",
        "Use MFA for high-value accounts",
      ]),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "bcrypt/argon2 with appropriate cost",
        "Re-hash on login after parameter upgrades",
        "Treat passwords as highly sensitive data",
      ]),
    ),
  ),

  "security:security-headers": L(
    "Add middleware or reverse-proxy headers like `X-Content-Type-Options`, `X-Frame-Options`, and `Strict-Transport-Security` to harden browsers.",
    "HTTP security headers for FastAPI — middleware examples and what each header prevents.",
    mdx(
      h2("Why this matters"),
      p(
        "Headers tell browsers to block MIME sniffing, clickjacking, and downgrade attacks. They are cheap defense-in-depth alongside HTTPS and input validation.",
      ),
      h2("Middleware example"),
      py(`from starlette.middleware.base import BaseHTTPMiddleware

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

app.add_middleware(SecurityHeadersMiddleware)`),
      p(
        "Set `Strict-Transport-Security` only when HTTPS is always available.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Security headers complement HTTPS",
        "Middleware is a simple place to set them",
        "Many proxies can inject headers too",
      ]),
    ),
  ),

  "security:preventing-sql-injection": L(
    "Use SQLAlchemy ORM queries or bound parameters—never build SQL with f-strings from user input.",
    "Prevent SQL injection in FastAPI — parameterized queries, ORM usage, and dangerous patterns to avoid.",
    mdx(
      h2("Why this matters"),
      p(
        "SQL injection lets attackers run arbitrary database commands—dumping users, bypassing login, or deleting tables. It remains a top OWASP risk when developers concatenate strings into SQL.",
      ),
      h2("Safe vs unsafe"),
      py(`# Safe — ORM filter uses parameters
db.query(User).filter(User.email == email).first()

# Safe — text() with bindparams
from sqlalchemy import text
db.execute(text("SELECT * FROM users WHERE email = :e"), {"e": email})`),
      callout(
        "warning",
        "Unsafe: db.execute(f\"SELECT * FROM users WHERE email = '{email}'\")",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Prefer ORM or bound parameters",
        "Never interpolate user input into SQL strings",
        "Audit raw SQL carefully",
      ]),
    ),
  ),

  "security:preventing-xss": L(
    "Escape user content in HTML templates, set Content-Security-Policy headers, and return JSON APIs that front-ends render safely.",
    "Prevent XSS in FastAPI apps — Jinja2 autoescape, CSP, and separating API JSON from HTML rendering.",
    mdx(
      h2("Why this matters"),
      p(
        "Cross-site scripting runs attacker JavaScript in victims' browsers—stealing cookies or performing actions as the user. Any user-generated HTML or script must be treated as hostile.",
      ),
      h2("Defenses"),
      ul([
        "Jinja2 auto-escapes `{{ variable }}` in HTML",
        "Avoid `| safe` unless content is fully trusted",
        "Content-Security-Policy limits inline scripts",
        "For SPAs, escape when inserting API data into DOM",
      ]),
      p(
        "JSON responses alone do not cause XSS—browsers do not execute JSON. Risk appears when JavaScript writes API data into `innerHTML`.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Escape output in HTML templates",
        "Use CSP headers",
        "Never trust user input in HTML",
      ]),
    ),
  ),

  "security:preventing-csrf": L(
    "Protect cookie-based sessions with CSRF tokens on state-changing forms; APIs using Authorization headers are less vulnerable to classic CSRF.",
    "Prevent CSRF in FastAPI — tokens, SameSite cookies, and when bearer tokens change the threat model.",
    mdx(
      h2("Why this matters"),
      p(
        "CSRF tricks a logged-in browser into submitting a form to your site. Cookie sessions are vulnerable; bearer tokens in headers (not sent automatically cross-site) reduce classic CSRF for pure APIs.",
      ),
      h2("Mitigations"),
      ul([
        "**SameSite cookies** (`Lax` or `Strict`)",
        "**CSRF token** in forms validated server-side",
        "**Double-submit cookie** pattern for SPAs",
        "Require custom headers for JSON APIs",
      ]),
      callout(
        "tip",
        "FastAPI JSON APIs with `Authorization: Bearer` often skip CSRF; HTML form apps need explicit tokens.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "CSRF targets cookie auth",
        "Use tokens + SameSite for session sites",
        "Bearer-header APIs have different risks",
      ]),
    ),
  ),

  "security:api-security-best-practices": L(
    "Combine HTTPS, auth, validation, rate limits, least-privilege secrets, logging without PII, and dependency updates for a defensible API.",
    "API security best practices for FastAPI — checklist for production APIs and common mistakes.",
    mdx(
      h2("Why this matters"),
      p(
        "Security is layered. One missing piece—a public admin route, verbose errors leaking stack traces, or secrets in git—undermines everything else. A short checklist helps teams ship safely.",
      ),
      h2("Checklist"),
      ul([
        "HTTPS everywhere in production",
        "Validate all input with Pydantic",
        "Hash passwords; short-lived JWTs + refresh rotation",
        "Rate limit login and expensive endpoints",
        "Store secrets in environment variables",
        "Keep dependencies updated (`pip audit`)",
        "Return generic errors to clients; log details server-side",
        "Enable CORS only for trusted origins",
      ]),
      p(
        "Review OpenAPI docs exposure: disable public `/docs` in production if they reveal internal operations.",
      ),
      h3("In practice"),
      p(
        "Apply this on your machine: create a virtual environment, install FastAPI and Uvicorn, implement one route that demonstrates today's topic, then call it from Swagger UI at `/docs` or with curl. When something fails—422 validation, 404, or a database connection error—read the response body and fix one issue before moving on. That tight feedback loop makes the idea stick better than rereading alone.",
      ),
      h2("Recap"),
      ul([
        "Defense in depth—no single fix is enough",
        "Automate dependency and secret scanning in CI",
        "Treat security as ongoing operations, not a one-time task",
      ]),
    ),
  ),
};
