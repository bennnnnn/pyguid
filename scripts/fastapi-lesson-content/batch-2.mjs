/** @typedef {{ quickAnswer: string; description: string; body: string }} LessonContent */

/** @type {Record<string, LessonContent>} */
export const LESSONS = {
  // ── 11. Validation & Error Handling ──────────────────────────────────────

  "validation-error-handling:validation-errors": {
    quickAnswer:
      "FastAPI returns HTTP 422 with a structured detail list when path, query, header, or body data fails Pydantic validation.",
    description:
      "Learn how FastAPI's automatic 422 validation errors work and how clients read the detail array.",
    body: `## Why this matters

Clients send typos, wrong types, and missing fields constantly. Your API should fail **predictably** before business logic runs. FastAPI validates every parameter with Pydantic and returns **422 Unprocessable Entity** with a \`detail\` array—each item includes \`loc\`, \`msg\`, and \`type\` so frontends can highlight the right field.

\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

@app.post("/items/")
def create_item(item: Item):
    return item
\`\`\`

POST \`{"name": "shirt", "price": "free"}\` never reaches \`create_item\`. FastAPI responds with 422 because \`price\` must be a number. The \`loc\` field might be \`["body", "price"]\`, telling your UI exactly where to show the error.

The same mechanism applies to path parameters (\`/users/abc\` when an \`int\` is expected), query strings, cookies, and headers. You do not write manual \`if not valid\` checks for basic types—validation is declarative on your function signature.

## Recap

- Validation runs **before** your route function executes.
- Failures return **422** with a list in \`detail\`, not a generic 500.
- Use \`loc\` and \`msg\` to build user-friendly form errors on the client.`,
  },

  "validation-error-handling:custom-exceptions": {
    quickAnswer:
      "Define application-specific exception classes and raise them in routes; pair them with handlers to return consistent JSON error shapes.",
    description:
      "Create custom exception types for domain errors like insufficient stock or duplicate email.",
    body: `## Why this matters

\`HTTPException\` works for simple cases, but real apps need **domain errors**: \`InsufficientStock\`, \`DuplicateEmail\`, \`PaymentDeclined\`. Custom exception classes keep route code readable and let you centralize how each error type maps to HTTP status and JSON.

\`\`\`python
class InsufficientStock(Exception):
    def __init__(self, product_id: str, requested: int, available: int):
        self.product_id = product_id
        self.requested = requested
        self.available = available

@app.post("/orders/")
def place_order(item_id: str, qty: int):
    stock = get_stock(item_id)
    if qty > stock:
        raise InsufficientStock(item_id, qty, stock)
    return {"status": "placed"}
\`\`\`

Without a handler, an unhandled custom exception becomes a **500**. Register an \`@app.exception_handler(InsufficientStock)\` to return **409 Conflict** with a stable JSON body your mobile app can parse. Group related errors under a base class (\`AppError\`) when you want one handler with a \`code\` field.

Keep exceptions for **exceptional** business failures, not normal control flow. Prefer returning optional values or Result types only when your team already uses that pattern everywhere.

## Recap

- Custom exceptions express **domain** problems clearly in route code.
- Always register a matching **exception handler** or clients see 500.
- Return consistent JSON (\`code\`, \`message\`, optional \`meta\`) across error types.`,
  },

  "validation-error-handling:httpexception": {
    quickAnswer:
      "Raise HTTPException(status_code, detail) inside a route to return 4xx/5xx responses with a message or structured detail.",
    description:
      "Use HTTPException for intentional API errors like 404 Not Found or 403 Forbidden.",
    body: `## Why this matters

Not every error is a validation failure. When a user ID does not exist or a token is invalid, you need to stop the request and return the right **HTTP status** with a clear message. \`HTTPException\` is FastAPI's built-in tool for that—no manual \`Response\` construction required.

\`\`\`python
from fastapi import FastAPI, HTTPException

app = FastAPI()

fake_db = {"ada": {"name": "Ada"}}

@app.get("/users/{username}")
def get_user(username: str):
    if username not in fake_db:
        raise HTTPException(status_code=404, detail="User not found")
    return fake_db[username]
\`\`\`

The \`detail\` argument can be a **string** or a **dict/list** for structured errors. Use **404** for missing resources, **403** for permission denied, **401** for missing auth, and **400** for malformed business rules that are not Pydantic validation issues.

Import \`status\` from \`fastapi\` for readable constants: \`status.HTTP_404_NOT_FOUND\`. Avoid catching \`HTTPException\` in broad handlers unless you intend to modify it—FastAPI already converts it to the correct response.

## Recap

- \`HTTPException\` = intentional HTTP error from inside a route.
- Pick the correct **status code**; do not default everything to 400.
- \`detail\` can be text or structured data for API consumers.`,
  },

  "validation-error-handling:global-exception-handlers": {
    quickAnswer:
      "Register @app.exception_handler(Exception) (or specific types) to log errors and return uniform JSON for unhandled failures.",
    description:
      "Centralize error handling with global exception handlers in FastAPI.",
    body: `## Why this matters

Without global handlers, an unexpected bug leaks a **stack trace** or generic 500 HTML to clients. Production APIs need one place to **log** the real error, hide internals, and return a stable JSON envelope—while still letting \`HTTPException\` and validation errors behave as designed.

\`\`\`python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

@app.exception_handler(Exception)
async def unhandled_exception(request: Request, exc: Exception):
    # log exc with request id here
    return JSONResponse(
        status_code=500,
        content={"error": "internal_error", "message": "Something went wrong"},
    )
\`\`\`

Register handlers for **specific** types first (\`InsufficientStock\`, \`HTTPException\`), then a catch-all for \`Exception\`. Starlette's exception middleware runs handlers in order of specificity. For \`RequestValidationError\`, use a dedicated handler if you want to reshape 422 responses for your API version.

In development, you might re-raise or include \`detail\` for debugging; in production, never return raw exception strings to untrusted clients.

## Recap

- Global handlers give **one** place for logging and safe 500 responses.
- Handle specific exception types before a broad \`Exception\` handler.
- Override \`RequestValidationError\` only when you need a custom 422 format.`,
  },

  "validation-error-handling:custom-error-responses": {
    quickAnswer:
      "Document and return custom error models with responses={404: ...} and matching exception handlers.",
    description:
      "Shape error JSON and document error schemas in OpenAPI with custom error responses.",
    body: `## Why this matters

Public APIs promise a **contract**. If success returns \`{"data": ...}\` but errors are random strings, SDK generators and frontend teams suffer. Custom error **Pydantic models** plus \`responses=\` on the route document every failure shape in OpenAPI/Swagger.

\`\`\`python
from pydantic import BaseModel

class ErrorOut(BaseModel):
    code: str
    message: str

@app.get(
    "/items/{item_id}",
    responses={404: {"model": ErrorOut, "description": "Item not found"}},
)
def get_item(item_id: int):
    item = db.get(item_id)
    if not item:
        raise HTTPException(
            status_code=404,
            detail={"code": "not_found", "message": f"No item {item_id}"},
        )
    return item
\`\`\`

Pair \`responses=\` with exception handlers that return the same model so runtime output matches docs. For validation, subclass the default 422 handler and return your \`ValidationErrorOut\` with field-level \`errors\` array. Clients and QA can rely on documented codes like \`duplicate_email\` instead of parsing English sentences.

## Recap

- Use Pydantic models for **error bodies** and list them in \`responses=\`.
- Keep \`code\` machine-readable; keep \`message\` human-readable.
- Align exception handlers with what OpenAPI documents.`,
  },

  // ── 12. Request Validation Advanced ──────────────────────────────────────

  "request-validation-advanced:regex-validation": {
    quickAnswer:
      "Use Field(pattern=r\"...\") or Annotated[str, Query(pattern=\"...\")] to enforce regex rules on strings.",
    description:
      "Validate string parameters with regular expression patterns in FastAPI and Pydantic v2.",
    body: `## Why this matters

Usernames, slugs, and country codes often must match a **strict format**. Regex validation rejects bad input at the edge so your database and business rules see only clean strings. In Pydantic v2, use \`Field(pattern=...)\` on model fields or \`Query(pattern=...)\` on parameters.

\`\`\`python
from typing import Annotated
from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/users/by-tag/{tag}")
def by_tag(tag: Annotated[str, Query(pattern=r"^[a-z0-9-]{3,32}$")]):
    return {"tag": tag}
\`\`\`

On a Pydantic model:

\`\`\`python
from pydantic import BaseModel, Field

class Signup(BaseModel):
    username: str = Field(pattern=r"^[a-zA-Z0-9_]{3,20}$")
\`\`\`

Invalid values yield **422** with a clear validation message. Test patterns with real examples—including edge cases like hyphens at the start—before deploying. Prefer simple, documented patterns over giant regexes nobody can maintain.

## Recap

- \`pattern=\` on \`Field\` or \`Query\` enforces regex at validation time.
- Failed matches return **422** like any other validation error.
- Keep regexes short and documented; complex rules may need custom validators.`,
  },

  "request-validation-advanced:length-validation": {
    quickAnswer:
      "Constrain strings and collections with Field(min_length=, max_length=) and size limits on lists.",
    description:
      "Apply min and max length validation to strings, lists, and other types in FastAPI.",
    body: `## Why this matters

Unbounded strings are a **DoS vector**—huge JSON bodies exhaust memory. Passwords, bios, and tags need sensible **min/max length** so storage and UI stay consistent. Pydantic enforces these limits before your route runs.

\`\`\`python
from pydantic import BaseModel, Field

class PostCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    body: str = Field(min_length=1, max_length=10_000)
    tags: list[str] = Field(min_length=1, max_length=5)
\`\`\`

For query parameters:

\`\`\`python
from typing import Annotated
from fastapi import Query

q: Annotated[str, Query(min_length=2, max_length=50)]
\`\`\`

Each tag string can also use \`Field(max_length=30)\` inside the model. Violations produce 422 with \`type\` values like \`string_too_long\`. Document limits in your API reference so clients validate on their side too.



## In practice

Add \`max_length\` on usernames in the API, mirror it in the database column, and set \`maxlength\` on HTML inputs so users see the same rule three times. For nested lists of tags, constrain both how many tags (\`max_length=10\` on the list) and how long each tag string may be. Log when clients repeatedly hit length limits—that often signals a buggy integration rather than abuse.

## Recap

- Use \`min_length\` / \`max_length\` on strings and \`min_length\` / \`max_length\` on lists.
- Enforce limits at the API boundary to protect the database and UX.
- Document limits in OpenAPI via Field descriptions.`,
  },

  "request-validation-advanced:numeric-validation": {
    quickAnswer:
      "Use Field(ge=, le=, gt=, lt=) on ints and floats to enforce ranges on prices, ages, and pagination.",
    description:
      "Validate numeric ranges for query params and JSON fields with Pydantic constraints.",
    body: `## Why this matters

A negative \`quantity\`, a \`page_size\` of one million, or a \`discount\` above 100% breaks business logic. **Numeric constraints** on path, query, and body fields catch these mistakes early with precise 422 messages.

\`\`\`python
from typing import Annotated
from fastapi import FastAPI, Query
from pydantic import BaseModel, Field

app = FastAPI()

class Product(BaseModel):
    price: float = Field(gt=0, le=1_000_000)
    stock: int = Field(ge=0)

@app.get("/products/")
def list_products(
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
):
    return {"page": page, "page_size": page_size}
\`\`\`

\`ge\` / \`le\` mean greater-or-equal and less-or-equal; \`gt\` / \`lt\` exclude the boundary. Use them consistently in your API style guide so pagination and IDs follow the same rules everywhere.

## Recap

- \`Field(gt=0)\` and friends work on model fields and Annotated query params.
- Combine range checks with correct types (\`int\` vs \`float\`) for IDs and money.
- Document allowed ranges in Field descriptions for OpenAPI consumers.`,
  },

  "request-validation-advanced:email-validation": {
    quickAnswer:
      "Use EmailStr from pydantic (or pydantic_extra_types) on model fields to validate email addresses.",
    description:
      "Validate email fields in request bodies with Pydantic's EmailStr type.",
    body: `## Why this matters

Signup and notification endpoints accept email addresses constantly. Manual regex is error-prone; **EmailStr** uses battle-tested validation and integrates with OpenAPI as \`format: email\`.

\`\`\`python
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str
\`\`\`

Install email validation support if your environment requires it (\`email-validator\` package). Invalid emails return 422 before you hit the database or send a verification message.

\`\`\`python
from fastapi import FastAPI

app = FastAPI()

@app.post("/users/")
def register(user: UserCreate):
    return {"email": user.email}
\`\`\`

For optional emails, use \`EmailStr | None\` with a default of \`None\`. Normalize emails in one place (lowercase domain rules) in a \`model_validator\` if your product requires it—validation and normalization are separate concerns.



## In practice

Ship \`email-validator\` in production requirements and add a pytest that posts \`user@domain\` without a TLD to confirm 422. For B2B apps, optionally normalize with \`.lower()\` on the domain part via a \`field_validator\`. Disposable-email blocking belongs in a validator that calls a static denylist or external API, not in \`EmailStr\` itself.

## Recap

- \`EmailStr\` validates format and documents \`format: email\` in OpenAPI.
- Ensure \`email-validator\` is installed where Pydantic expects it.
- Combine with uniqueness checks in your route or service layer.`,
  },

  "request-validation-advanced:uuid-validation": {
    quickAnswer:
      "Use UUID type annotations on path or body fields so only valid UUID strings are accepted.",
    description:
      "Accept and validate UUID path parameters and body fields in FastAPI.",
    body: `## Why this matters

Many APIs expose resources by **UUID** instead of sequential integers—safer against enumeration and easier to merge distributed systems. FastAPI coerces valid UUID strings into Python \`uuid.UUID\` objects; invalid strings never reach your handler.

\`\`\`python
from uuid import UUID
from fastapi import FastAPI

app = FastAPI()

@app.get("/orders/{order_id}")
def get_order(order_id: UUID):
    return {"order_id": str(order_id)}
\`\`\`

Request \`/orders/not-a-uuid\` and FastAPI returns **422** automatically. In Pydantic models:

\`\`\`python
from pydantic import BaseModel
from uuid import UUID

class OrderRef(BaseModel):
    parent_id: UUID | None = None
\`\`\`

Serialize back to clients with \`str(uuid)\` in JSON responses. Store UUIDs in Postgres as \`uuid\` type, not varchar, when you control the schema.



## In practice

Path params typed as \`UUID\` stop garbage IDs before a database round trip. In Postgres prefer the \`uuid\` column type; return \`str(uuid)\` in JSON for JavaScript clients. When accepting optional UUID foreign keys, use \`UUID | None\` and document whether omission means “no filter” or “null relation”.

## Recap

- Annotate parameters with \`UUID\` for automatic parsing and 422 on bad input.
- Invalid UUID strings are rejected before your route logic runs.
- Return UUIDs as strings in JSON for broad client compatibility.`,
  },

  "request-validation-advanced:custom-validators": {
    quickAnswer:
      "Use @field_validator and @model_validator on Pydantic models for cross-field rules and custom checks.",
    description:
      "Write custom Pydantic validators for passwords, date ranges, and business rules.",
    body: `## Why this matters

Not every rule fits \`min_length\` or \`pattern\`. Passwords must match confirmation; end dates must be after start dates; coupon codes must exist in your database. **Pydantic validators** run during request parsing and produce the same 422 flow as built-in checks.

\`\`\`python
from pydantic import BaseModel, field_validator, model_validator

class Booking(BaseModel):
    start: str
    end: str

    @model_validator(mode="after")
    def end_after_start(self):
        if self.end <= self.start:
            raise ValueError("end must be after start")
        return self
\`\`\`

\`\`\`python
class PasswordChange(BaseModel):
    password: str
    confirm: str

    @field_validator("confirm")
    @classmethod
    def passwords_match(cls, v, info):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("passwords do not match")
        return v
\`\`\`

Keep validators **fast**—avoid heavy DB calls in hot paths; use dependencies for that. Raise \`ValueError\` with clear messages; Pydantic wraps them into validation errors.

## Recap

- \`@field_validator\` for single fields; \`@model_validator\` for cross-field logic.
- Validators run automatically when FastAPI parses the request body.
- Prefer dependencies for I/O-heavy checks; validators for pure logic.`,
  },

  // ── 13. Path Operation Configuration ─────────────────────────────────────

  "path-operation-configuration:tags": {
    quickAnswer:
      "Group endpoints in OpenAPI with tags=[\"Users\"] on @app.get/post or APIRouter(tags=[...]).",
    description:
      "Organize FastAPI routes with tags for clearer Swagger UI and ReDoc navigation.",
    body: `## Why this matters

A growing API might have hundreds of routes. **Tags** group related endpoints in Swagger UI and ReDoc—\"Users\", \"Orders\", \"Admin\"—so developers find operations quickly and generated SDKs can namespace methods.

\`\`\`python
from fastapi import APIRouter, FastAPI

app = FastAPI()
users = APIRouter(prefix="/users", tags=["Users"])

@users.get("/")
def list_users():
    return []

@users.post("/", tags=["Users", "Admin"])
def create_user():
    return {"created": True}

app.include_router(users)
\`\`\`

Set tags on the **router** for defaults, or on individual routes for finer control. Multiple tags place an operation under several sections. Tags appear in the OpenAPI \`tags\` array and do not change URLs or behavior—pure documentation and tooling.



## In practice

Define \`openapi_tags=[{"name": "Users", "description": "..."}]\` on the app so Swagger shows prose above each group. Split admin-only routes under an \`Admin\` tag rather than mixing them with public CRUD. Generated Python SDKs often create one module per tag—messy tag names become messy packages.

## Recap

- \`tags=\` on routes or \`APIRouter\` groups endpoints in auto-generated docs.
- Use consistent tag names across your team’s style guide.
- Tags do not affect routing—only documentation and client generation.`,
  },

  "path-operation-configuration:summaries": {
    quickAnswer:
      "Add a short summary= on each route decorator; it appears as the operation title in OpenAPI UIs.",
    description:
      "Set concise operation summaries on FastAPI path operations for better API docs.",
    body: `## Why this matters

The auto-generated doc UI shows one line per endpoint. A clear **summary**—\"List active users\", \"Cancel subscription\"—beats a vague function name like \`read_users_v2\` for everyone scanning the API.

\`\`\`python
@app.get(
    "/users/",
    summary="List users",
    response_description="Paginated user list",
)
def list_users():
    return []
\`\`\`

Summaries should be **short** (often under 80 characters). Put longer explanations in \`description=\`. If you omit \`summary\`, FastAPI may derive one from the function name—fine for internal tools, weak for public APIs.

When using \`APIRouter\`, summaries on included routes merge into the main OpenAPI schema unchanged.



## In practice

Write summaries as imperative phrases: \`List active subscriptions\`, \`Cancel subscription\`. Avoid repeating the HTTP verb when Swagger already shows GET. For internal microservices, summaries help more than long descriptions because engineers scan the operation list constantly during integration.

## Recap

- \`summary=\` is the one-line title in Swagger/ReDoc.
- Write summaries for **humans** reading the docs, not for Python style.
- Use \`description=\` for paragraphs; keep summaries brief.`,
  },

  "path-operation-configuration:descriptions": {
    quickAnswer:
      "Use description= with Markdown on routes to document behavior, auth, and side effects in OpenAPI.",
    description:
      "Write rich path operation descriptions that render in Swagger UI and ReDoc.",
    body: `## Why this matters

Summaries are one line; **descriptions** explain auth requirements, idempotency, rate limits, and side effects. FastAPI supports **Markdown** in descriptions, which Swagger UI renders with headings and lists.

\`\`\`python
@app.post(
    "/transfer/",
    summary="Transfer funds",
    description="""
    Move money between two accounts.

    - Requires **Bearer** token
    - Idempotent when \`Idempotency-Key\` header is sent
    - Returns **402** if insufficient balance
    """,
)
def transfer():
    return {"status": "ok"}
\`\`\`

You can also set \`description\` on the \`FastAPI()\` app and on \`APIRouter\` for section-level intros. Docstrings on the function can become the description if you enable it, but explicit \`description=\` avoids surprises when docstrings mix implementation notes with API contracts.



## In practice

Document idempotency keys, required scopes, and side effects (sends email, charges card) in Markdown descriptions. Link to status page or SLA docs when external teams integrate. If the route is beta, say so here and in \`openapi_extra\` extensions your gateway understands.

## Recap

- \`description=\` supports Markdown for detailed operation docs.
- Document auth, errors, and headers consumers must send.
- Keep public descriptions accurate— they are part of your API contract.`,
  },

  "path-operation-configuration:metadata": {
    quickAnswer:
      "Pass openapi_extra, operation_id, include_in_schema, and deprecated flags to fine-tune OpenAPI metadata per route.",
    description:
      "Configure OpenAPI metadata on FastAPI path operations beyond tags and summaries.",
    body: `## Why this matters

Client generators and API gateways read **OpenAPI metadata**: stable \`operation_id\`, custom extensions, whether an route appears in public docs. FastAPI exposes these on each path operation decorator.

\`\`\`python
@app.get(
    "/internal/health/",
    include_in_schema=False,
)
def health():
    return {"ok": True}

@app.get(
    "/items/{id}",
    operation_id="getItemById",
    openapi_extra={
        "x-audience": "public",
    },
)
def get_item(id: int):
    return {"id": id}
\`\`\`

\`include_in_schema=False\` hides internal or legacy routes from published docs while keeping them live. Custom \`x-*\` fields document org-specific policies. Choose \`operation_id\` values that codegen tools turn into readable method names.



## In practice

Hide health checks with \`include_in_schema=False\` but keep them in metrics dashboards. Stable \`operation_id\` values prevent breaking OpenAPI Generator clients on every deploy. Use \`x-\` extensions for internal routing hints only when your API gateway actually reads them.

## Recap

- \`operation_id\`, \`openapi_extra\`, and \`include_in_schema\` tune generated OpenAPI.
- Hide health checks and admin routes from public schema when needed.
- Metadata does not change HTTP behavior—only documentation and tooling.`,
  },

  "path-operation-configuration:deprecation": {
    quickAnswer:
      "Mark routes with deprecated=True so OpenAPI shows them as deprecated and clients can migrate.",
    description:
      "Deprecate API endpoints in FastAPI and communicate migration in OpenAPI.",
    body: `## Why this matters

APIs evolve. You cannot delete \`/v1/users\` overnight without breaking mobile apps. **Deprecation** signals “still works, do not build new code on this” in Swagger UI (struck-through or flagged) while you ship \`/v2/users\`.

\`\`\`python
@app.get("/v1/users/", deprecated=True)
def list_users_v1():
    return {"warning": "use /v2/users/"}

@app.get("/v2/users/")
def list_users_v2():
    return {"users": []}
\`\`\`

Pair \`deprecated=True\` with **Sunset** headers or changelog entries in \`description=\`. Monitor traffic on deprecated routes before removal. Return \`410 Gone\` only after the agreed sunset date and communication window.



## In practice

Pair \`deprecated=True\` with monitoring on the old path’s request rate. Communicate sunset dates in release notes, not only in docs. When traffic hits zero for two release cycles, return \`410 Gone\` with a JSON body pointing to the replacement URL.

## Recap

- \`deprecated=True\` documents sunset in OpenAPI without removing the route.
- Tell consumers **what to use instead** in the description.
- Remove deprecated routes only after usage drops and notice periods.`,
  },

  "path-operation-configuration:response-descriptions": {
    quickAnswer:
      "Document each status code with responses={200: ...} and response_description= on the decorator.",
    description:
      "Add response descriptions and documented status codes to FastAPI operations.",
    body: `## Why this matters

Success is not the only outcome. Document **201 Created**, **204 No Content**, and error statuses so integrators know what to expect. \`response_description\` labels the default success response; \`responses=\` maps status codes to descriptions and models.

\`\`\`python
from pydantic import BaseModel

class UserOut(BaseModel):
    id: int
    email: str

@app.post(
    "/users/",
    response_model=UserOut,
    status_code=201,
    response_description="The created user",
    responses={
        409: {"description": "Email already registered"},
    },
)
def create_user():
    ...
\`\`\`

Combine \`responses=\` with \`response_model\` and exception handlers so docs match runtime JSON. For file downloads, set \`response_class=FileResponse\` and describe content type in the response description.



## In practice

List 201 for creates, 204 for deletes without bodies, and 409 for conflicts in \`responses=\`. Match documented error models with exception handlers so QA can assert schema compliance. File endpoints should mention content type and disposition in the response description.

## Recap

- \`response_description\` describes the primary success response.
- \`responses=\` documents additional status codes and optional models.
- Aligned docs reduce support tickets from API consumers.`,
  },

  // ── 14. Automatic Documentation ──────────────────────────────────────────

  "automatic-documentation:swagger-ui": {
    quickAnswer:
      "FastAPI serves interactive Swagger UI at /docs by default, generated from your routes and Pydantic models.",
    description:
      "Explore and test your API with FastAPI's built-in Swagger UI at /docs.",
    body: `## Why this matters

You could maintain a separate Postman collection forever—or let FastAPI build **interactive docs** from your code. **Swagger UI** at \`/docs\` lists every route, shows schemas from Pydantic models, and lets you send real requests against a running server.

\`\`\`python
from fastapi import FastAPI

app = FastAPI(
    title="Shop API",
    version="1.0.0",
    description="Internal commerce API",
)

@app.get("/items/")
def list_items():
    return []
\`\`\`

Start Uvicorn, open \`http://127.0.0.1:8000/docs\`, expand an operation, click **Try it out**, fill parameters, and execute. Auth schemes (\`OAuth2\`, API keys) appear when configured. Swagger UI stays in sync because the **OpenAPI schema** is generated at startup from your type hints.



## In practice

Try OAuth2 flows from Swagger only on trusted networks. Customize \`swagger_ui_parameters\` to persist authorization during a long debugging session. When routes move between routers, confirm tags and summaries still appear—stale docs confuse more than missing docs.

## Recap

- Default Swagger UI lives at **/docs** on a standard FastAPI app.
- Docs update automatically when you change routes and models.
- Use app metadata (\`title\`, \`version\`, \`description\`) for a professional doc header.`,
  },

  "automatic-documentation:redoc": {
    quickAnswer:
      "ReDoc at /redoc renders the same OpenAPI schema in a three-panel, reading-friendly layout.",
    description:
      "Use ReDoc as an alternative API reference UI for your FastAPI application.",
    body: `## Why this matters

Swagger UI excels at **trying** endpoints; **ReDoc** excels at **reading**—clean typography, nested schemas, and a layout partners prefer for PDF-like reference pages. FastAPI serves ReDoc at \`/redoc\` using the same OpenAPI JSON as Swagger.

\`\`\`python
app = FastAPI(
    title="Shop API",
    redoc_url="/redoc",
)
\`\`\`

Share \`/redoc\` with frontend teams and external integrators who do not need an execute button on every operation. Customize \`redoc_url\` or disable it in production if you publish docs elsewhere—set \`redoc_url=None\` when turning off ReDoc entirely.

Both UIs reflect **one source of truth**: your Python types and route decorators.



## In practice

Share \`/redoc\` links with partners who only read schemas. ReDoc loads the same \`openapi.json\` as Swagger—fix schema bugs once. If execute-in-browser is risky, expose ReDoc publicly and restrict \`/docs\` to VPN users.

## Recap

- ReDoc is available at **/redoc** by default.
- Same OpenAPI schema powers Swagger UI and ReDoc.
- Choose ReDoc for readable reference; Swagger for interactive testing.`,
  },

  "automatic-documentation:openapi-schema": {
    quickAnswer:
      "The OpenAPI JSON schema lives at /openapi.json and describes paths, parameters, and component schemas.",
    description:
      "Understand FastAPI's generated OpenAPI schema at /openapi.json.",
    body: `## Why this matters

OpenAPI (formerly Swagger) is the **contract** between your service and tools—code generators, gateways, mock servers. FastAPI builds **OpenAPI 3.x** JSON from routes, \`response_model\`, and \`Field\` metadata without a separate YAML file.

\`\`\`python
app = FastAPI()

@app.get("/openapi.json", include_in_schema=False)
def hidden():
    pass  # don't shadow the real schema

# Visit http://127.0.0.1:8000/openapi.json
\`\`\`

The schema lists \`paths\`, \`components.schemas\` for each Pydantic model, security schemes, and tags. Export it in CI and diff on pull requests to catch accidental breaking changes. Override pieces with \`openapi_tags\`, custom \`openapi\` callback, or \`app.openapi()\` caching in advanced setups.



## In practice

Export \`/openapi.json\` in CI and diff against the previous release to catch accidental removals of fields. Pin schema snapshots per API version (\`v1\`, \`v2\`). Tools like Speakeasy and Fern consume this file—treat breaking changes as product releases.

## Recap

- Raw schema at **/openapi.json** drives both doc UIs.
- Pydantic models become \`components.schemas\` automatically.
- Treat the exported schema as part of your API versioning story.`,
  },

  "automatic-documentation:customizing-docs": {
    quickAnswer:
      "Customize docs with docs_url, redoc_url, swagger_ui_parameters, and custom CSS or OAuth redirect URLs.",
    description:
      "Customize Swagger UI, ReDoc, and app metadata in FastAPI documentation.",
    body: `## Why this matters

Default docs are fine for development; production often needs **branding**, auth flows, or stricter try-it-out defaults. FastAPI lets you tune URLs and Swagger UI parameters without forking the framework.

\`\`\`python
app = FastAPI(
    title="Acme API",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    swagger_ui_parameters={"persistAuthorization": True},
)
\`\`\`

Serve **custom CSS** by mounting static files and overriding Swagger’s \`swagger_ui_init_oauth\` or using third-party recipes for logos. Set \`terms_of_service\`, \`contact\`, and \`license_info\` on \`FastAPI()\` for legal and support links in the published schema.



## In practice

Load \`docs_url\` from settings: enabled in dev/staging, disabled in production. Add \`contact\` and \`license_info\` for public APIs. Custom CSS logos help internal developer portals feel polished without forking FastAPI itself. Document the public doc URL in your README so new engineers find it quickly.

## Recap

- Rename doc paths with \`docs_url\`, \`redoc_url\`, \`openapi_url\`.
- \`swagger_ui_parameters\` adjusts Swagger behavior (e.g. persist auth).
- Fill \`contact\` and \`license_info\` for complete public API metadata.`,
  },

  "automatic-documentation:disabling-docs": {
    quickAnswer:
      "Set docs_url=None, redoc_url=None, and optionally openapi_url=None to disable auto-generated documentation endpoints.",
    description:
      "Disable Swagger UI, ReDoc, and OpenAPI exposure in production FastAPI apps.",
    body: `## Why this matters

Public **/docs** on production can leak every internal route and schema to attackers. Many teams disable interactive docs in production while keeping them in staging, or publish docs on a separate portal.

\`\`\`python
import os
from fastapi import FastAPI

show_docs = os.getenv("ENV") != "production"

app = FastAPI(
    docs_url="/docs" if show_docs else None,
    redoc_url="/redoc" if show_docs else None,
    openapi_url="/openapi.json" if show_docs else None,
)
\`\`\`

Setting all three to \`None\` removes the endpoints entirely. You can still generate OpenAPI offline in CI from the app object for internal use. Never rely on “security through obscurity”—protect admin routes with auth regardless of docs visibility.



## In practice

Disabling \`/docs\` does not hide your API from attackers—security still requires auth. Generate OpenAPI offline with a management command and upload to a private portal. Never commit production secrets into example servers linked from docs.

## Recap

- \`docs_url=None\` and \`redoc_url=None\` remove doc UIs.
- \`openapi_url=None\` hides the raw schema endpoint too.
- Use environment-based flags to keep docs in dev/staging only.`,
  },

  "automatic-documentation:routes-docs": {
    quickAnswer:
      "The /docs route serves Swagger UI; customize or relocate it with docs_url on the FastAPI app.",
    description:
      "How the /docs route works in FastAPI and when to change its URL.",
    body: `## Why this matters

Teams bookmark **/docs** during development. Knowing it is a normal Starlette route—not magic—helps you put it behind auth, change the path, or proxy it through nginx.

\`\`\`python
app = FastAPI(docs_url="/docs")

# Same UI at a different path:
app = FastAPI(docs_url="/developer/swagger")
\`\`\`

FastAPI registers a route that returns HTML loading Swagger UI from a CDN and points it at your \`openapi_url\` (default \`/openapi.json\`). If \`docs_url=None\`, that route is not registered. Some deployments mount the API at \`/api\` and set \`root_path\` so generated URLs behind a proxy stay correct.



## In practice

Behind nginx, set \`root_path\` or \`--root-path\` so Swagger fetches \`/openapi.json\` from the public URL. Broken schema URLs yield blank Swagger pages even when curl works. Some teams mount docs at \`/api/docs\` via \`docs_url\` to match gateway path prefixes.

## Recap

- **/docs** is the default Swagger UI route (\`docs_url\`).
- Change the path with \`docs_url="/custom"\` or disable with \`None\`.
- Works with \`root_path\` when the app sits behind a reverse proxy.`,
  },

  "automatic-documentation:routes-redoc": {
    quickAnswer:
      "The /redoc route serves the ReDoc HTML client, configurable via redoc_url.",
    description:
      "How the /redoc route works in FastAPI and how to relocate or disable it.",
    body: `## Why this matters

Just like \`/docs\`, **/redoc** is an explicit route serving ReDoc’s HTML shell and loading your OpenAPI spec. Operations teams sometimes expose only ReDoc publicly while hiding Swagger’s execute buttons.

\`\`\`python
app = FastAPI(redoc_url="/redoc")

app_internal = FastAPI(redoc_url="/reference")
\`\`\`

Set \`redoc_url=None\` to remove the route—pair with disabling \`docs_url\` in locked-down environments. The ReDoc page fetches \`openapi_url\`; if that URL is wrong behind a proxy, configure \`root_path\` or absolute URLs in your deployment docs.



## In practice

ReDoc at \`/redoc\` is independent of Swagger’s HTML—both hit the same schema. Rename with \`redoc_url\` if your site already uses \`/redoc\` for something else. Large schemas may load slowly; consider splitting routers with separate OpenAPI exports for monoliths. Partners often bookmark ReDoc for schema review during integration sprints.

## Recap

- **/redoc** is the default ReDoc route (\`redoc_url\`).
- Customize with \`redoc_url="/reference"\` or disable with \`None\`.
- ReDoc requires access to the OpenAPI JSON URL you configure.`,
  },

  // ── 15. Async Programming ────────────────────────────────────────────────

  "async-programming:async-and-await": {
    quickAnswer:
      "Use async def and await to run I/O-bound work on the event loop without blocking other requests.",
    description:
      "Learn async and await syntax for FastAPI route functions and I/O calls.",
    body: `## Why this matters

Traditional sync views **block** the worker thread while waiting on databases or HTTP calls. **async/await** lets the server handle other requests during those waits—critical for I/O-heavy APIs at scale.

\`\`\`python
import httpx
from fastapi import FastAPI

app = FastAPI()

@app.get("/github/{user}")
async def github_user(user: str):
    async with httpx.AsyncClient() as client:
        r = await client.get(f"https://api.github.com/users/{user}")
    return r.json()
\`\`\`

\`async def\` defines a coroutine route; \`await\` pauses **only that request** until the I/O completes. You cannot \`await\` a regular sync function that performs blocking I/O—you need async libraries (\`httpx\`, \`asyncpg\`) or run sync code in a thread pool.



## In practice

Audit libraries before going async: \`requests\`, sync SQLAlchemy, and \`time.sleep\` block the loop. Prefer \`httpx\`, asyncpg, and \`asyncio.sleep\`. If half your stack is sync, \`def\` routes in a thread pool are simpler than fake async.

## Recap

- \`async def\` routes run on the asyncio event loop.
- \`await\` async I/O; do not block the loop with \`time.sleep\` or sync DB drivers.
- Match async routes with async-capable libraries.`,
  },

  "async-programming:async-routes": {
    quickAnswer:
      "Declare routes with async def when using await inside; use def for purely sync handlers—FastAPI runs sync routes in a thread pool.",
    description:
      "Choose between async def and def for FastAPI path operation functions.",
    body: `## Why this matters

FastAPI supports both \`def\` and \`async def\` handlers. Picking the wrong one—\`async def\` with blocking ORM calls inside—**blocks the entire event loop** and defeats async benefits.

\`\`\`python
@app.get("/sync-ok")
def read_sync():
    return {"mode": "threadpool"}

@app.get("/async-io")
async def read_async():
    await asyncio.sleep(0.01)  # stand-in for async I/O
    return {"mode": "async"}
\`\`\`

Use **async def** when the handler \`await\`s async database drivers, HTTP clients, or file I/O. Use plain **def** for quick CPU-only logic or when your stack is entirely synchronous—FastAPI runs \`def\` endpoints in a thread pool so they do not block the loop. Mixing styles in one app is normal.



## In practice

Load-test \`async def\` endpoints with concurrent clients; blocking ORM code inside them often shows worse throughput than sync routes. Use \`httpx.AsyncClient\` in tests. Document which endpoints are async so operators tune worker and pool sizes correctly.

## Recap

- \`async def\` + \`await\` for non-blocking I/O paths.
- \`def\` for sync code; FastAPI offloads it to threads.
- Never call blocking I/O directly inside \`async def\` without a thread pool.`,
  },

  "async-programming:async-vs-sync": {
    quickAnswer:
      "Async helps I/O concurrency; sync is simpler for CPU-bound or all-sync libraries—do not make every endpoint async by default.",
    description:
      "Compare async and sync FastAPI endpoints and when to use each.",
    body: `## Why this matters

**Async is not faster** for everything—it reduces waiting when many requests share I/O-bound work. CPU-heavy tasks (image processing, big JSON parsing) do not speed up with \`async\`; they need more processes or workers.

| Situation | Prefer |
|-----------|--------|
| Async HTTP/DB drivers | \`async def\` |
| Legacy sync SQLAlchemy | \`def\` (thread pool) |
| Heavy CPU work | \`def\` + workers, or task queue |

\`\`\`python
# Bad: blocks the event loop
@app.get("/bad")
async def bad():
    time.sleep(2)
    return {}

# Better: sync route or await async sleep / thread pool
\`\`\`

Measure with load tests. A simple CRUD API on sync SQLAlchemy behind Gunicorn workers is often enough. Add async when connection counts and latency profiles justify the complexity.

## Recap

- Async shines for **I/O concurrency**, not CPU crunching.
- Sync endpoints are fine and run in a **thread pool**.
- Profile before converting an entire codebase to async.`,
  },

  "async-programming:non-blocking-operations": {
    quickAnswer:
      "Prefer await on async libraries; offload blocking work with run_in_executor or sync def routes.",
    description:
      "Keep the FastAPI event loop non-blocking with proper async patterns.",
    body: `## Why this matters

One **blocking** call inside \`async def\`—\`requests.get\`, \`open().read()\` on a huge file, \`time.sleep\`—stalls all concurrent requests on that worker. Non-blocking discipline means the event loop always has work it can switch to.

\`\`\`python
import asyncio
from fastapi import FastAPI

app = FastAPI()

def blocking_task():
    return sum(range(10_000))

@app.get("/compute")
async def compute():
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, blocking_task)
    return {"result": result}
\`\`\`

Prefer **native async** APIs first. Use \`run_in_executor\` for unavoidable sync libraries. For file uploads, stream with async iterators where supported. Background tasks still should not block the loop if they run on the same worker.



## In practice

Wrap legacy sync SDK calls in \`run_in_executor\` with a bounded pool, or isolate them in Celery workers. Watch event loop lag metrics—when p99 spikes on unrelated endpoints, search for hidden blocking calls in middleware or dependencies.

## Recap

- Blocking the event loop hurts **all** requests on that worker.
- Use async libraries, \`run_in_executor\`, or \`def\` routes for blocking code.
- Audit third-party SDKs for async support before \`await\`ing them.`,
  },

  "async-programming:async-database-calls": {
    quickAnswer:
      "Use async DB drivers (asyncpg, SQLAlchemy 2 async session) and await session.execute inside async def routes.",
    description:
      "Perform non-blocking database access in FastAPI with async SQLAlchemy or asyncpg.",
    body: `## Why this matters

Database round-trips dominate API latency. **Async drivers** let your app serve other requests while Postgres responds. Pair them with dependency-injected sessions and proper session lifecycle.

\`\`\`python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

engine = create_async_engine("postgresql+asyncpg://user:pass@localhost/db")
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

@app.get("/items/")
async def list_items(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Item))
    return result.scalars().all()
\`\`\`

Use \`create_async_engine\` and \`await session.execute\`—never the sync engine inside \`async def\`. Close sessions in the dependency’s \`finally\` or context manager to avoid connection leaks under load.



## In practice

Create one \`AsyncSession\` per request via \`yield\` dependencies; commit in services, rollback on errors. Size the pool to \`(workers × expected concurrent queries per request)\`. Never share sessions across tasks or background threads.

## Recap

- Async SQLAlchemy 2.x + **asyncpg** is a common Postgres stack.
- Inject \`AsyncSession\` via \`Depends\` and always \`await\` queries.
- Do not mix sync sessions inside \`async def\` handlers.`,
  },

  "async-programming:performance-concepts": {
    quickAnswer:
      "Scale with multiple Uvicorn workers, avoid blocking the loop, pool DB connections, and measure—not guess.",
    description:
      "FastAPI async performance: workers, connection pools, and realistic expectations.",
    body: `## Why this matters

**Async alone** does not replace capacity planning. Throughput comes from multiple worker processes, efficient queries, caching, and keeping the event loop free. A common mistake is one Uvicorn worker and blocking ORM calls labeled “async.”

\`\`\`bash
uvicorn main:app --workers 4 --loop uvloop
\`\`\`

Use **connection pooling** for databases; tune pool size to workers × expected concurrency. Add Redis caching for hot reads. Profile with tools like py-spy or APM before micro-optimizing \`await\` placement. CPU-bound work belongs in Celery/RQ workers, not API request handlers.

Latency and RPS depend on your slowest dependency—usually the database or external HTTP—not FastAPI overhead itself.



## In practice

Run locust or k6 against staging with realistic payloads. Add workers with Gunicorn+Uvicorn when CPU-bound; add async I/O when waiting on external APIs. Cache hot reads in Redis before rewriting ORM layers in async.

## Recap

- Run **multiple workers**; one process has one event loop.
- Pool DB connections; avoid N+1 queries regardless of async.
- Offload heavy CPU and long jobs to **background workers**.`,
  },

  // ── 16. File Uploads ─────────────────────────────────────────────────────

  "file-uploads:uploading-files": {
    quickAnswer:
      "Accept uploads with file: UploadFile = File(...) in a multipart form POST handler.",
    description:
      "Handle single file uploads in FastAPI with UploadFile and File().",
    body: `## Why this matters

Users upload avatars, CSV imports, and attachments through **multipart/form-data**. FastAPI’s \`UploadFile\` wraps the incoming stream with filename and content type metadata—better than reading raw bytes into memory blindly.

\`\`\`python
from fastapi import FastAPI, File, UploadFile

app = FastAPI()

@app.post("/upload/")
async def upload(file: UploadFile = File(...)):
    contents = await file.read()
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "size": len(contents),
    }
\`\`\`

Use \`async def\` and \`await file.read()\` for large files consider **streaming** chunks instead of loading everything at once. Validate size limits at the proxy (nginx \`client_max_body_size\`) and in application code.



## In practice

Set nginx \`client_max_body_size\` and application limits consistently. For antivirus, stream chunks to the scanner. Return 413 with a clear message when limits are exceeded so clients can split uploads.

## Recap

- \`UploadFile\` + \`File(...)\` handles one uploaded file per field.
- \`await file.read()\` loads content; stream for large files.
- Set reverse-proxy body size limits in addition to app checks.`,
  },

  "file-uploads:multiple-files": {
    quickAnswer:
      "Accept several files with list[UploadFile] = File(...) on one form field or multiple named fields.",
    description:
      "Upload multiple files in a single FastAPI request.",
    body: `## Why this matters

Gallery uploads and batch imports send **many files** in one request. FastAPI accepts a list of \`UploadFile\` objects from the same form field name repeated or from distinct field names.

\`\`\`python
from typing import Annotated
from fastapi import FastAPI, File, UploadFile

app = FastAPI()

@app.post("/upload-many/")
async def upload_many(
    files: Annotated[list[UploadFile], File()],
):
    return [
        {"filename": f.filename, "type": f.content_type}
        for f in files
    ]
\`\`\`

Process each file in a loop—virus scan, resize, store—and cap the **count** and **total size** to prevent abuse. Return per-file success and failure when partial success is acceptable.



## In practice

Cap file count (e.g. ten per request) and total bytes. Return an array of per-file results when partial success is allowed so UIs can retry only failed items. Document limits in OpenAPI descriptions.

## Recap

- \`list[UploadFile]\` with \`File()\` receives multiple files.
- Enforce max file count and aggregate size limits.
- Report per-file errors for better client UX on batch uploads.`,
  },

  "file-uploads:images": {
    quickAnswer:
      "Check content_type and file extension for images; resize or validate with Pillow after reading UploadFile.",
    description:
      "Handle image uploads in FastAPI with type checks and optional processing.",
    body: `## Why this matters

Image endpoints power avatars and product photos. Trusting \`filename.jpg\` is unsafe—clients can lie about **content type**. Verify magic bytes or use imaging libraries after upload, and strip dangerous EXIF if needed.

\`\`\`python
from fastapi import FastAPI, UploadFile, File, HTTPException

ALLOWED = {"image/jpeg", "image/png", "image/webp"}

@app.post("/avatar/")
async def avatar(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED:
        raise HTTPException(400, "Invalid image type")
    data = await file.read()
    # Pillow: Image.open(BytesIO(data)).verify()
    return {"bytes": len(data)}
\`\`\`

Generate thumbnails in a **background task** for large images so the HTTP response stays fast. Serve stored files from object storage (S3) with signed URLs rather than streaming from app memory in production.



## In practice

Verify magic bytes with Pillow’s \`verify()\` after upload. Strip EXIF if it contains GPS data you should not store. Serve via CDN URLs; do not proxy large images through FastAPI workers in production.

## Recap

- Validate **content_type** and ideally file content, not just extension.
- Process heavy resizing asynchronously when possible.
- Store images in object storage; return URLs to clients.`,
  },

  "file-uploads:file-validation": {
    quickAnswer:
      "Validate uploads by size, extension, content type, and magic bytes before saving or processing.",
    description:
      "Validate uploaded files for type, size, and safety in FastAPI.",
    body: `## Why this matters

Unrestricted uploads are a path to **malware hosting**, disk fill attacks, and SSRF via XML parsers. Validate early: max bytes, allowed MIME types, and optionally scan with ClamAV in workers.

\`\`\`python
MAX_BYTES = 5 * 1024 * 1024

@app.post("/doc/")
async def upload_doc(file: UploadFile = File(...)):
    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(413, "File too large")
    if not file.filename.endswith((".pdf", ".txt")):
        raise HTTPException(400, "Unsupported extension")
    return {"ok": True}
\`\`\`

Never execute uploaded content. Store outside the web root with random filenames. Log rejected uploads for security monitoring.



## In practice

Block double extensions (\`report.pdf.exe\`). Scan in workers, not request handlers, for large files. Rate-limit upload routes per IP and per authenticated user separately from read traffic.

## Recap

- Enforce **size**, **type**, and **count** limits on every upload endpoint.
- Read with care—stream and abort when over limit mid-read.
- Scan and quarantine before treating uploads as trusted data.`,
  },

  "file-uploads:saving-files": {
    quickAnswer:
      "Write UploadFile content to disk with aiofiles or shutil, using safe unique paths outside the web root.",
    description:
      "Save uploaded files to disk or storage from FastAPI UploadFile handlers.",
    body: `## Why this matters

After validation, persist files to **disk**, S3, or a CDN. Use unpredictable names (\`uuid4()\`) so attackers cannot guess URLs. Async write avoids blocking the event loop on large files.

\`\`\`python
import uuid
from pathlib import Path
import aiofiles
from fastapi import UploadFile

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

async def save_upload(file: UploadFile) -> Path:
    dest = UPLOAD_DIR / f"{uuid.uuid4()}_{file.filename}"
    async with aiofiles.open(dest, "wb") as out:
        while chunk := await file.read(1024 * 1024):
            await out.write(chunk)
    return dest
\`\`\`

Reset file pointer with \`await file.seek(0)\` if you read twice. In production, upload to **object storage** from the app or via presigned URLs so app servers stay stateless.



## In practice

Use \`aiofiles\` or chunked reads; chmod upload dirs narrowly. Prefer S3 presigned uploads for huge files so app servers stay stateless. Never use user-supplied filenames as the on-disk path without sanitization.

## Recap

- Use **unique filenames** and dedicated upload directories.
- Stream chunks to disk for large files.
- Prefer S3-compatible storage for horizontal scaling.`,
  },

  "file-uploads:streaming-files": {
    quickAnswer:
      "Stream downloads with StreamingResponse or FileResponse; stream uploads by reading UploadFile in chunks.",
    description:
      "Stream file uploads and downloads in FastAPI without loading entire files into memory.",
    body: `## Why this matters

Loading a 500 MB video into RAM crashes workers. **Streaming** sends or receives data in chunks—constant memory usage and faster time-to-first-byte for downloads.

\`\`\`python
from fastapi.responses import StreamingResponse, FileResponse

@app.get("/download/{name}")
def download(name: str):
    path = UPLOAD_DIR / name
    return FileResponse(path, media_type="application/octet-stream")

def iterfile(path):
    with open(path, "rb") as f:
        yield from f

@app.get("/stream/{name}")
def stream(name: str):
    return StreamingResponse(iterfile(UPLOAD_DIR / name))
\`\`\`

For uploads, read \`UploadFile\` in a loop and write each chunk to storage. Set \`Content-Disposition\` headers so browsers offer a filename on download.



## In practice

Use \`FileResponse\` for on-disk files and generators for dynamically built exports. For video, put CloudFront or nginx in front instead of streaming gigabytes through Python. Set \`Content-Disposition\` for downloads.

## Recap

- \`FileResponse\` for efficient file downloads from disk.
- \`StreamingResponse\` for generated or piped byte streams.
- Read uploads in **chunks**, not one giant \`read()\` when files are large.`,
  },

  // ── 17. Form Data ────────────────────────────────────────────────────────

  "form-data:html-forms": {
    quickAnswer:
      "HTML forms POST application/x-www-form-urlencoded or multipart data; FastAPI reads them with Form() parameters.",
    description:
      "Connect HTML forms to FastAPI using form-encoded and multipart requests.",
    body: `## Why this matters

Not every client sends JSON. Browser **HTML forms** default to \`application/x-www-form-urlencoded\`; forms with \`enctype="multipart/form-data"\` send files. FastAPI maps fields to Python parameters with \`Form()\`.

\`\`\`html
<form action="http://127.0.0.1:8000/login/" method="post">
  <input name="username" />
  <input name="password" type="password" />
  <button type="submit">Login</button>
</form>
\`\`\`

\`\`\`python
from fastapi import FastAPI, Form

@app.post("/login/")
def login(username: str = Form(...), password: str = Form(...)):
    return {"username": username}
\`\`\`

Install \`python-multipart\` for form parsing. JSON APIs and form APIs can coexist on the same app—choose the content type per endpoint.



## In practice

Install \`python-multipart\` in all environments—forms fail mysteriously without it. Traditional server-rendered apps POST forms; SPAs usually send JSON. Pick one style per endpoint and document it. Server-rendered admin panels still rely on forms; test them with curl using -F flags.

## Recap

- Forms use **Form()** parameters, not JSON body models.
- \`multipart/form-data\` is required when mixing files and fields.
- Install **python-multipart** for form support.`,
  },

  "form-data:form": {
    quickAnswer:
      "Import Form from fastapi and declare form fields as function parameters with Form(...).",
    description:
      "Read HTML form fields in FastAPI with the Form dependency.",
    body: `## Why this matters

\`Form()\` tells FastAPI to read a field from the **request body** when the content type is form-encoded, not from query strings. Optional fields use defaults; required fields use \`Form(...)\`.

\`\`\`python
from typing import Annotated
from fastapi import FastAPI, Form

app = FastAPI()

@app.post("/items/")
def create_item(
    name: Annotated[str, Form()],
    qty: Annotated[int, Form()] = 1,
):
    return {"name": name, "qty": qty}
\`\`\`

You cannot mix a JSON \`BaseModel\` body and \`Form()\` on the same endpoint—pick one style per route. For many fields, consider a dependency that builds a Pydantic model from form data manually.



## In practice

Each \`Form()\` field maps to a form key. You cannot send JSON and multipart in one handler—split endpoints. For many fields, a small Pydantic model built manually from \`Request.form()\` keeps types organized.

## Recap

- \`Form()\` binds individual form keys to parameters.
- Same validation rules apply—types are coerced and validated.
- One endpoint = one body style (JSON **or** form, not both).`,
  },

  "form-data:combining-forms-and-files": {
    quickAnswer:
      "In one endpoint, mix Form() fields and UploadFile with File() under multipart/form-data.",
    description:
      "Accept form fields and file uploads together in a single FastAPI route.",
    body: `## Why this matters

“Create post with title + image” needs **text fields and a file** in one POST. Multipart encoding carries both; FastAPI declares each part separately.

\`\`\`python
from fastapi import FastAPI, Form, File, UploadFile

@app.post("/posts/")
async def create_post(
    title: str = Form(...),
    body: str = Form(""),
    image: UploadFile | None = File(None),
):
    saved = None
    if image:
        saved = await save_upload(image)
    return {"title": title, "image": str(saved) if saved else None}
\`\`\`

The HTML form must use \`enctype="multipart/form-data"\`. Swagger UI’s “Try it out” supports mixed form and file fields for testing. Validate file and field limits as in dedicated upload lessons.



## In practice

HTML must use \`enctype="multipart/form-data"\`. In Swagger, use the file+fields Try-it-out UI to verify before building the frontend. Validate text and files with the same size and type rules as single-upload routes.

## Recap

- Use **Form()** for text fields and **File()** for uploads in one handler.
- Requires **multipart/form-data** from the client.
- Validate files and metadata together before persisting.`,
  },

  "form-data:login-forms": {
    quickAnswer:
      "OAuth2PasswordRequestForm provides username and password fields for token login endpoints used by Swagger and form clients.",
    description:
      "Build login forms and token endpoints with FastAPI's OAuth2 password form.",
    body: `## Why this matters

Password login from forms and Swagger’s **Authorize** button expects \`username\` and \`password\` form fields—not JSON. \`OAuth2PasswordRequestForm\` standardizes that shape for token-issuing routes.

\`\`\`python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

@app.post("/token")
def login(form: OAuth2PasswordRequestForm = Depends()):
    user = authenticate(form.username, form.password)
    if not user:
        raise HTTPException(401, "Invalid credentials")
    return {"access_token": create_token(user), "token_type": "bearer"}
\`\`\`

HTML login pages POST to \`/token\` with the same field names. Add CSRF protection for cookie-based sessions when using browser forms; pure token APIs for SPAs often use JSON instead—both patterns are valid with different security models.



## In practice

\`OAuth2PasswordRequestForm\` expects \`username\` and \`password\` keys—match them in HTML inputs. SPAs may JSON-post credentials instead; both are valid with different CSRF implications for cookie sessions.

## Recap

- \`OAuth2PasswordRequestForm\` expects **username** and **password** form fields.
- Pair with your JWT or session issuance logic after authentication.
- Document the token URL in OpenAPI security schemes.`,
  },

  // ── 18. Headers & Cookies ────────────────────────────────────────────────

  "headers-cookies:reading-headers": {
    quickAnswer:
      "Read headers with Header() parameters or the Request object; custom headers often use the X- prefix or standard names.",
    description:
      "Access request headers in FastAPI path operations and dependencies.",
    body: `## Why this matters

APIs use headers for **Authorization**, **correlation IDs**, **pagination cursors**, and feature flags. FastAPI injects them as typed parameters—invalid types yield 422 like any other input.

\`\`\`python
from typing import Annotated
from fastapi import FastAPI, Header

app = FastAPI()

@app.get("/items/")
def list_items(
    x_request_id: Annotated[str | None, Header()] = None,
    authorization: Annotated[str | None, Header()] = None,
):
    return {"request_id": x_request_id}
\`\`\`

Header names are case-insensitive; Python parameters use underscores instead of hyphens (\`X-Request-Id\` → \`x_request_id\`). For full access to all headers, inject \`Request\` and use \`request.headers\`.



## In practice

Use \`Header()\` for API keys and correlation IDs; use \`Request.headers.get\` for rare dynamic names. Document required headers in OpenAPI so Swagger shows input boxes. Remember underscores map to hyphens.

## Recap

- \`Header()\` declares expected request headers with validation.
- Underscores in parameter names map to hyphens in HTTP.
- Use \`Request.headers\` when you need dynamic or uncommon header names.`,
  },

  "headers-cookies:custom-headers": {
    quickAnswer:
      "Return custom headers with Response(headers={...}) or a JSONResponse; use standard names when possible.",
    description:
      "Set custom response headers in FastAPI responses.",
    body: `## Why this matters

Responses carry **metadata**: rate-limit remaining, ETags, pagination links. Custom headers communicate with browsers and API gateways—prefer registered or \`X-\` prefixed names documented in your API spec.

\`\`\`python
from fastapi import FastAPI
from fastapi.responses import JSONResponse

@app.get("/items/")
def list_items():
    return JSONResponse(
        content=[],
        headers={
            "X-Total-Count": "42",
            "Cache-Control": "private, max-age=60",
        },
    )
\`\`\`

Alternatively, return a \`Response\` subclass and set headers on a dependency that wraps the response. Avoid leaking internal debug headers in production. **CORS** exposes only whitelisted headers to browsers via \`expose_headers\`.



## In practice

Expose rate-limit headers to browsers only if listed in CORS \`expose_headers\`. Prefer standard \`Cache-Control\` over custom cache headers when possible. Internal debug headers should be stripped in production middleware. Gateways may strip unknown headers—confirm proxies forward custom names end to end.

## Recap

- Set headers on \`JSONResponse\`, \`Response\`, or \`FileResponse\`.
- Document custom \`X-\` headers for API consumers.
- Configure CORS \`expose_headers\` if browsers must read them.`,
  },

  "headers-cookies:setting-cookies": {
    quickAnswer:
      "Set cookies on a Response with response.set_cookie(key, value, httponly=True, ...).",
    description:
      "Set HTTP cookies on FastAPI responses with secure attribute options.",
    body: `## Why this matters

Sessions and refresh tokens often live in **cookies**. Setting them from FastAPI requires attaching to the outgoing \`Response\`—returning a dict alone does not set cookies.

\`\`\`python
from fastapi import FastAPI
from fastapi.responses import JSONResponse

@app.post("/session/")
def create_session():
    response = JSONResponse({"ok": True})
    response.set_cookie(
        key="session_id",
        value="signed-token-here",
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=3600,
    )
    return response
\`\`\`

Use \`httponly\` to block JavaScript theft, \`secure\` on HTTPS, and \`samesite\` to mitigate CSRF. Sign or encrypt cookie values server-side; never store raw passwords in cookies.



## In practice

Sign cookie values (itsdangerous, JWT) server-side. On logout, \`delete_cookie\` with the same \`path\` and \`domain\` used at login. Short \`max_age\` on session cookies limits stolen-cookie window. Rotate signing keys on a schedule without invalidating all sessions at once when possible.

## Recap

- Build a \`Response\`, call \`set_cookie\`, return that response.
- Use **httponly**, **secure**, and **samesite** for session cookies.
- Prefer short-lived access tokens in memory for SPAs when not using cookies.`,
  },

  "headers-cookies:reading-cookies": {
    quickAnswer:
      "Read cookies with Cookie() parameters, e.g. session_id: str | None = Cookie(None).",
    description:
      "Read incoming HTTP cookies in FastAPI route handlers.",
    body: `## Why this matters

Authenticated browser clients send cookies automatically. Server routes read them with \`Cookie()\`—same pattern as \`Header()\` and \`Query()\`.

\`\`\`python
from typing import Annotated
from fastapi import FastAPI, Cookie, HTTPException

@app.get("/me")
def me(session_id: Annotated[str | None, Cookie()] = None):
    if not session_id:
        raise HTTPException(401, "Not logged in")
    user = decode_session(session_id)
    return {"user": user}
\`\`\`

Validate and **verify** cookie values (signature, expiry) before trusting them. For APIs that only use Bearer tokens, cookies may be absent—do not require cookies on mobile JSON endpoints unless intentional.



## In practice

Treat cookie values as untrusted input until signature and expiry verify. Separate session cookies from marketing tracking cookies. Mobile Bearer-token clients may ignore cookies entirely—design auth accordingly. Prefer short cookie names and small payloads to stay under browser per-domain limits.

## Recap

- \`Cookie()\` injects a named cookie with optional validation.
- Always verify signed/session cookies before use.
- Separate cookie-based browser auth from Bearer-token API clients if needed.`,
  },

  "headers-cookies:secure-cookies": {
    quickAnswer:
      "Use httponly, secure, samesite, and short max_age; prefer HTTPS and CSRF tokens for cookie-based auth.",
    description:
      "Secure cookie practices for FastAPI session and authentication cookies.",
    body: `## Why this matters

Stolen session cookies equal account takeover. **Secure cookie flags** reduce XSS and MITM risk; they complement HTTPS and CSRF defenses, not replace them.

| Flag | Purpose |
|------|---------|
| HttpOnly | JS cannot read the cookie |
| Secure | Sent only over HTTPS |
| SameSite | Limits cross-site sending |

\`\`\`python
response.set_cookie(
    "refresh_token",
    value=token,
    httponly=True,
    secure=True,
    samesite="strict",
    max_age=7 * 24 * 3600,
    path="/auth/refresh",
)
\`\`\`

Rotate refresh tokens on use. Avoid storing sensitive JWT claims in client-readable cookies unless encrypted. For cross-subdomain apps, plan \`Domain\` and \`Path\` carefully—overbroad domain scope increases blast radius.



## In practice

Production requires HTTPS with \`secure=True\`. Use \`SameSite=strict\` for admin sites; \`lax\` when top-level navigation must send cookies. Rotate refresh tokens and bind sessions to user agent where paranoia is warranted.

## Recap

- Always set **httponly** and **secure** for session cookies in production.
- Use **SameSite** and CSRF protection for cookie-authenticated forms.
- Scope \`path\` and \`domain\` narrowly; keep lifetimes short.`,
  },

  // ── 19. Middleware ─────────────────────────────────────────────────────────

  "middleware:what-middleware-is": {
    quickAnswer:
      "Middleware wraps every request and response—run code before the route and after the response is built.",
    description:
      "Understand what middleware is and how it fits into FastAPI/Starlette.",
    body: `## Why this matters

Cross-cutting concerns—logging, security headers, timing—should not be copy-pasted into every route. **Middleware** is a function that receives the request, can modify it, calls the next layer, then can modify the outgoing response.

\`\`\`python
from fastapi import FastAPI, Request

app = FastAPI()

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-App"] = "PyGuide"
    return response
\`\`\`

Middleware runs for **all** matching routes—including \`/docs\` unless excluded. Order matters: the first added middleware runs outermost on the way in. Built-in middleware handles CORS, gzip, and trusted hosts.



## In practice

Order matters: CORS often sits outermost. Each middleware adds latency—keep logic tiny. Compare with dependencies when code needs DB access only on some routes, not globally.

## Recap

- Middleware wraps the whole app: **request in**, **response out**.
- Use it for shared logic that is not specific to one route.
- Too much work in middleware slows every endpoint.`,
  },

  "middleware:request-lifecycle": {
    quickAnswer:
      "A request passes through middleware stack → routing → dependencies → route → response, then back through middleware.",
    description:
      "Follow a FastAPI request through middleware, routing, and dependencies.",
    body: `## Why this matters

Debugging “why is my header missing?” requires knowing **order**: middleware runs before routing; dependencies run before your function; exception handlers may short-circuit the flow.

\`\`\`
Client
  → Middleware (outer → inner)
  → Router matches path
  → Dependencies resolve (DB, auth)
  → Route function
  → Response
  → Middleware (inner → outer)
  → Client
\`\`\`

If auth fails in a dependency, middleware that expected a post-handler log still runs on the error response path. **Lifespan** events (startup/shutdown) are separate—they initialize pools before any request arrives.



## In practice

Exceptions short-circuit to handlers, then responses still pass outward through middleware. Startup lifespan hooks run before any middleware sees traffic—initialize pools there. WebSockets bypass some HTTP middleware.

## Recap

- Requests go **down** the middleware stack and **up** on the response.
- Dependencies run after a route is matched but before the handler.
- Exception handlers produce responses that still pass through middleware.`,
  },

  "middleware:custom-middleware": {
    quickAnswer:
      "Add @app.middleware(\"http\") async functions or class-based BaseHTTPMiddleware for custom request/response logic.",
    description:
      "Write custom HTTP middleware in FastAPI.",
    body: `## Why this matters

Custom middleware implements request IDs, maintenance mode, or adding security headers globally—one implementation, zero route changes.

\`\`\`python
import uuid
from fastapi import FastAPI, Request

app = FastAPI()

@app.middleware("http")
async def request_id_middleware(request: Request, call_next):
    request.state.request_id = str(uuid.uuid4())
    response = await call_next(request)
    response.headers["X-Request-Id"] = request.state.request_id
    return response
\`\`\`

Use \`request.state\` to pass data to routes on the same request. Avoid heavy computation; prefer dependencies for database access. \`BaseHTTPMiddleware\` is an alternative class style—be aware of subtle context issues with some async patterns.



## In practice

Store \`request_id\` on \`request.state\` for logs downstream. Avoid ORM in middleware—use dependencies. For streaming responses, prefer pure ASGI middleware over \`BaseHTTPMiddleware\` quirks. Unit-test middleware by calling it with a mock app and inspecting response headers. Keep middleware free of database transactions.

## Recap

- \`@app.middleware("http")\` is the common custom middleware pattern.
- Store per-request data on \`request.state\`.
- Keep middleware fast; use dependencies for DB and complex auth.`,
  },

  "middleware:logging-middleware": {
    quickAnswer:
      "Log method, path, status, and duration in middleware after call_next returns.",
    description:
      "Add request logging middleware to FastAPI applications.",
    body: `## Why this matters

Production debugging needs **structured logs** per request: who called what, how long it took, and which status code returned. Middleware captures everything—including 404s and validation failures—that never hit your route’s print statements.

\`\`\`python
import logging
import time
from fastapi import Request

logger = logging.getLogger("api")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    ms = (time.perf_counter() - start) * 1000
    logger.info(
        "%s %s %s %.1fms",
        request.method,
        request.url.path,
        response.status_code,
        ms,
    )
    return response
\`\`\`

Correlate with \`X-Request-Id\` from another middleware. Do not log passwords, tokens, or full credit card numbers—scrub sensitive headers and bodies.



## In practice

Log one line per request after \`call_next\` with status and duration. Redact \`Authorization\` and cookies. Ship JSON logs to your aggregator with stable field names for dashboards.

## Recap

- Log **after** \`call_next\` when status and duration are known.
- Include method, path, status, and timing.
- Never log secrets; use structured logging in production.`,
  },

  "middleware:timing-middleware": {
    quickAnswer:
      "Measure elapsed time around call_next and expose it via X-Process-Time or metrics middleware.",
    description:
      "Add timing middleware to measure request duration in FastAPI.",
    body: `## Why this matters

Slow endpoints hide in averages until you measure **per request**. Timing middleware adds a response header for quick debugging and feeds Prometheus histograms in larger setups.

\`\`\`python
import time
from fastapi import Request

@app.middleware("http")
async def timing(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    elapsed = time.perf_counter() - start
    response.headers["X-Process-Time"] = f"{elapsed:.4f}"
    return response
\`\`\`

Compare timings with and without database calls to find bottlenecks. Headers are visible to clients—fine for internal APIs; for public APIs prefer server-side metrics only.



## In practice

Compare \`X-Process-Time\` with APM traces to find middleware vs route vs DB time. Remove timing headers on public APIs if they aid attackers mapping slow endpoints. Compare timings before and after deploys to catch performance regressions early.

## Recap

- Time the full handler chain with \`perf_counter\` around \`call_next\`.
- Expose optional **X-Process-Time** for debugging.
- Pair with APM (Datadog, OpenTelemetry) for production tracing.`,
  },

  "middleware:cors-middleware": {
    quickAnswer:
      "Add CORSMiddleware with allow_origins, allow_methods, and allow_headers so browsers can call your API from other domains.",
    description:
      "Configure CORS in FastAPI with Starlette's CORSMiddleware.",
    body: `## Why this matters

Browsers block frontend JavaScript from reading cross-origin API responses unless the server sends **CORS headers**. \`CORSMiddleware\` adds \`Access-Control-Allow-Origin\` and handles **preflight** \`OPTIONS\` requests automatically.

\`\`\`python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.example.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
\`\`\`

\`allow_origins=["*"]\` cannot be used with \`allow_credentials=True\`. List explicit origins in production. Middleware order: add CORS **before** other middleware that might error on OPTIONS.



## In practice

Register CORSMiddleware before auth middleware that might 401 OPTIONS preflights. Tighten \`allow_headers\` to \`Authorization\`, \`Content-Type\`, and headers you actually send. Use \`max_age\` to cache preflight success. Log rejected origins in staging to discover frontend URLs missing from the allow list. Review CORS config whenever you add a new frontend deployment target.

## Recap

- **CORSMiddleware** is required for browser SPAs on another origin.
- Never use wildcard origins with credentials in production.
- Preflight OPTIONS is handled by the middleware—no manual route needed.`,
  },

  // ── 20. CORS ─────────────────────────────────────────────────────────────

  "cors:what-cors-is": {
    quickAnswer:
      "CORS is a browser security policy; servers opt in with Access-Control-* headers so JavaScript on another origin can read responses.",
    description:
      "Learn what Cross-Origin Resource Sharing (CORS) is and why browsers enforce it.",
    body: `## Why this matters

**Same-origin policy** stops evil.com’s JavaScript from reading your bank’s API responses in the user’s browser. **CORS** lets your API say “app.example.com is allowed to read my JSON.” Server-to-server calls (curl, mobile apps) ignore CORS—only browsers enforce it.

\`\`\`
Browser at https://app.example.com
  → fetch("https://api.example.com/items")
  → Browser checks Access-Control-Allow-Origin on response
\`\`\`

Without proper headers, the browser hides the response from JavaScript even if the server returned 200. CORS is not a substitute for authentication—anyone can still call your API with curl.



## In practice

curl and mobile apps ignore CORS; only browsers enforce it. CORS does not stop attackers from calling your API directly—it controls whether evil.com’s JavaScript can read responses in a victim’s browser session. Teach frontend developers that Postman working does not prove browser CORS is configured.

## Recap

- CORS applies to **browser** cross-origin requests, not all clients.
- The server must send **Access-Control-*** headers to opt in.
- FastAPI uses **CORSMiddleware** to add those headers.`,
  },

  "cors:cross-origin-requests": {
    quickAnswer:
      "Simple GET/POST may skip preflight; JSON POST with custom headers triggers an OPTIONS preflight that must succeed first.",
    description:
      "Understand simple vs preflight cross-origin requests in the browser.",
    body: `## Why this matters

Developers see mysterious **OPTIONS** requests in DevTools—that is the **preflight**. The browser asks “is POST with Authorization allowed?” before sending the real POST. Your API must respond to OPTIONS with matching CORS headers.

| Request type | Preflight? |
|--------------|------------|
| GET, simple POST | Often no |
| JSON + custom headers | Yes (OPTIONS first) |

\`\`\`python
# CORSMiddleware answers OPTIONS and adds:
# Access-Control-Allow-Methods
# Access-Control-Allow-Headers
\`\`\`

If preflight fails, the browser never sends your actual request—fix \`allow_methods\` and \`allow_headers\` in middleware config. Non-simple content types like \`application/json\` usually trigger preflight.



## In practice

When DevTools shows CORS errors, inspect the OPTIONS response first. JSON POSTs with \`Authorization\` almost always preflight. Fix \`allow_methods\` and \`allow_headers\` before debugging the POST handler itself.

## Recap

- **Preflight** OPTIONS happens before many modern API calls.
- Middleware must allow the methods and headers your frontend uses.
- Missing preflight support looks like a “network error” in the browser.`,
  },

  "cors:frontend-backend-communication": {
    quickAnswer:
      "SPAs on localhost:5173 call APIs on localhost:8000—configure allow_origins for dev and production frontend URLs.",
    description:
      "Wire frontend and backend together with correct CORS and credentials settings.",
    body: `## Why this matters

Local dev often runs **Vite on :5173** and **FastAPI on :8000**—different origins. Production uses \`https://app\` and \`https://api\` subdomains. Both need CORS entries listing the **exact** frontend origin (scheme + host + port).

\`\`\`python
origins = [
    "http://localhost:5173",
    "https://app.example.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
\`\`\`

With cookies or \`Authorization\`, set \`allow_credentials=True\` and avoid \`*\` origins. The frontend must use \`credentials: "include"\` when cookies matter. Proxying API calls through the same origin in dev (Vite proxy) avoids CORS locally but production still needs real config.



## In practice

Maintain \`CORS_ORIGINS\` as a comma-separated env var deployed with both API and frontend. Include localhost ports for Vite and Create React App. With cookies, require \`credentials: "include"\` on fetch and explicit origins—never \`*\`.

## Recap

- List every **frontend origin** explicitly in \`allow_origins\`.
- Match \`allow_headers\` to what your SPA sends (e.g. Authorization).
- Dev proxies are optional; production CORS must be correct.`,
  },

  "cors:configuring-cors-safely": {
    quickAnswer:
      "Never use allow_origins=['*'] with credentials; whitelist production domains and minimize allowed methods and headers.",
    description:
      "Configure CORS securely in FastAPI for production APIs.",
    body: `## Why this matters

Overly permissive CORS—\`*\` origins with credentials, every method, every header—lets **any website** trigger authenticated browser requests if the user is logged in. Attackers host malicious pages that call your API with the user’s cookies.

\`\`\`python
# Unsafe for cookie auth:
# allow_origins=["*"], allow_credentials=True  # invalid combo

# Safer:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.example.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type", "X-Request-Id"],
    max_age=600,
)
\`\`\`

Load allowed origins from **environment variables**. Review CORS when adding admin panels or webhooks—webhooks are server-to-server and do not need browser CORS. Combine strict CORS with strong auth and CSRF strategy for cookie sessions.



## In practice

Audit origins quarterly when marketing adds preview domains. Webhooks and mobile backends do not need CORS. Pair strict origins with CSRF tokens for cookie-based sessions; CORS alone is never enough.

## Recap

- Whitelist **specific** origins; never wildcard with credentials.
- Allow only the **methods and headers** you actually need.
- CORS complements—but does not replace—authentication and CSRF defenses.`,
  },
};
