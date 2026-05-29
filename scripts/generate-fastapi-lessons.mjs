/**
 * Generates src/lib/fastapi-roadmap/sections.ts and src/content/fastapi-lessons/*.mdx
 * from the canonical topic list. Run: npm run generate:fastapi-lessons
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getLessonContent } from "./fastapi-lesson-content/index.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const lessonsDir = path.join(root, "src/content/fastapi-lessons");
const sectionsOut = path.join(root, "src/lib/fastapi-roadmap/sections.ts");

/** @type {[string, string, string[], string | undefined][]} */
const RAW = [
  ["introduction-to-fastapi", "Introduction to FastAPI", [
    "What is FastAPI",
    "Why FastAPI became popular",
    "FastAPI vs Flask vs Django",
    "ASGI vs WSGI",
    "FastAPI architecture overview",
    "Real-world use cases",
  ]],
  ["environment-setup", "Environment Setup", [
    "Installing Python",
    "Creating virtual environments",
    "Installing FastAPI",
    "Installing Uvicorn",
    "Project structure setup",
    "Running the first server",
    "Hot reload (`--reload`)",
  ]],
  ["your-first-api", "Your First API", [
    "Creating a FastAPI app",
    "Defining routes",
    "GET requests",
    "Returning JSON",
    "Path operations",
    "API testing in browser",
  ], `from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Hello"}`],
  ["http-methods", "HTTP Methods", ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]],
  ["route-parameters", "Route Parameters", [
    "Path parameters",
    "Query parameters",
    "Optional parameters",
    "Default values",
    "Type validation",
    "Enum parameters",
  ], `@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"id": user_id}`],
  ["request-body", "Request Body", [
    "Sending JSON data",
    "Reading request body",
    "Validation",
    "Nested data",
    "Optional fields",
    "Multiple body parameters",
  ]],
  ["pydantic-basics", "Pydantic Basics", [
    "What is Pydantic",
    "Creating models",
    "Data validation",
    "Default values",
    "Field types",
    "Nested models",
    "Model inheritance",
    "Serialization",
    "`.dict()` / `.model_dump()`",
  ], `from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int`],
  ["response-models", "Response Models", [
    "Response validation",
    "Hiding sensitive fields",
    "Custom responses",
    "Response schemas",
    "Status codes",
    "Response examples",
  ]],
  ["status-codes", "Status Codes", [
    "Common HTTP status codes",
    "Returning custom status codes",
    "Error responses",
    "REST conventions",
  ]],
  ["dependency-injection", "Dependency Injection", [
    "What dependencies are",
    "`Depends()`",
    "Shared logic",
    "Reusable components",
    "Injecting database sessions",
    "Injecting authentication",
  ]],
  ["validation-error-handling", "Validation & Error Handling", [
    "Validation errors",
    "Custom exceptions",
    "`HTTPException`",
    "Global exception handlers",
    "Custom error responses",
  ]],
  ["request-validation-advanced", "Request Validation Advanced", [
    "Regex validation",
    "Length validation",
    "Numeric validation",
    "Email validation",
    "UUID validation",
    "Custom validators",
  ]],
  ["path-operation-configuration", "Path Operation Configuration", [
    "Tags",
    "Summaries",
    "Descriptions",
    "Metadata",
    "Deprecation",
    "Response descriptions",
  ]],
  ["automatic-documentation", "Automatic Documentation", [
    "Swagger UI",
    "ReDoc",
    "OpenAPI schema",
    "Customizing docs",
    "Disabling docs",
    "Routes: `/docs`",
    "Routes: `/redoc`",
  ]],
  ["async-programming", "Async Programming", [
    "`async` and `await`",
    "Async routes",
    "Async vs sync",
    "Non-blocking operations",
    "Async database calls",
    "Performance concepts",
  ], `@app.get("/")
async def home():
    return {"message": "Async"}`],
  ["file-uploads", "File Uploads", [
    "Uploading files",
    "Multiple files",
    "Images",
    "File validation",
    "Saving files",
    "Streaming files",
  ]],
  ["form-data", "Form Data", ["HTML forms", "`Form()`", "Combining forms and files", "Login forms"]],
  ["headers-cookies", "Headers & Cookies", [
    "Reading headers",
    "Custom headers",
    "Setting cookies",
    "Reading cookies",
    "Secure cookies",
  ]],
  ["middleware", "Middleware", [
    "What middleware is",
    "Request lifecycle",
    "Custom middleware",
    "Logging middleware",
    "Timing middleware",
    "CORS middleware",
  ]],
  ["cors", "CORS", [
    "What CORS is",
    "Cross-origin requests",
    "Frontend/backend communication",
    "Configuring CORS safely",
  ]],
  ["static-files", "Static Files", [
    "Serving CSS",
    "Serving JavaScript",
    "Serving images",
    "Static folders",
  ]],
  ["templates", "Templates", [
    "Jinja2 templates",
    "Rendering HTML",
    "Passing data to templates",
    "Dynamic pages",
  ]],
  ["database-basics", "Database Basics", [
    "Why databases matter",
    "SQL vs NoSQL",
    "Connecting databases",
    "Environment configuration",
  ]],
  ["sqlalchemy", "SQLAlchemy", [
    "ORM concepts",
    "Models",
    "Tables",
    "Sessions",
    "CRUD operations",
    "Relationships",
    "Migrations",
  ]],
  ["sqlmodel", "SQLModel", [
    "What SQLModel is",
    "Combining Pydantic + SQLAlchemy",
    "CRUD with SQLModel",
  ]],
  ["alembic-migrations", "Alembic Migrations", [
    "Database migrations",
    "Generating migrations",
    "Upgrading/downgrading schema",
    "Version tracking",
  ]],
  ["crud-api-development", "CRUD API Development", [
    "Create endpoints",
    "Read endpoints",
    "Update endpoints",
    "Delete endpoints",
    "Pagination",
    "Filtering",
    "Searching",
  ]],
  ["authentication", "Authentication", [
    "Authentication concepts",
    "OAuth2",
    "Password hashing",
    "JWT tokens",
    "Login system",
    "Signup system",
    "Access tokens",
    "Refresh tokens",
  ]],
  ["authorization", "Authorization", [
    "Roles",
    "Permissions",
    "Admin systems",
    "Protected routes",
    "Access control",
  ]],
  ["security", "Security", [
    "HTTPS",
    "Password hashing",
    "Security headers",
    "Preventing SQL injection",
    "Preventing XSS",
    "Preventing CSRF",
    "API security best practices",
  ]],
  ["background-tasks", "Background Tasks", [
    "Running tasks in background",
    "Email sending",
    "Notifications",
    "Scheduled tasks basics",
  ]],
  ["websockets", "WebSockets", [
    "Real-time communication",
    "Chat applications",
    "Live updates",
    "Connection management",
  ]],
  ["api-versioning", "API Versioning", [
    "v1/v2 APIs",
    "Backward compatibility",
    "Version strategies",
  ]],
  ["testing", "Testing", [
    "Unit testing",
    "Integration testing",
    "`pytest`",
    "TestClient",
    "Mocking",
    "API testing",
  ]],
  ["logging", "Logging", [
    "Application logging",
    "Error logging",
    "Request logging",
    "Structured logs",
  ]],
  ["configuration-management", "Configuration Management", [
    "Environment variables",
    "`.env` files",
    "Secrets management",
    "Settings classes",
  ]],
  ["project-architecture", "Project Architecture", [
    "Scalable folder structures",
    "Routers",
    "Services",
    "Repositories",
    "Modular applications",
    "Large-scale API organization",
  ]],
  ["routers", "Routers", [
    "APIRouter",
    "Splitting routes",
    "Route prefixes",
    "Tags organization",
  ]],
  ["pagination-filtering", "Pagination & Filtering", [
    "Limit/offset pagination",
    "Cursor pagination",
    "Sorting",
    "Search filters",
  ]],
  ["rate-limiting", "Rate Limiting", [
    "Protecting APIs",
    "Throttling requests",
    "Abuse prevention",
  ]],
  ["caching", "Caching", ["Redis basics", "API caching", "Performance optimization"]],
  ["task-queues", "Task Queues", ["Celery", "Redis queues", "Background workers"]],
  ["deployment", "Deployment", [
    "Running in production",
    "Gunicorn + Uvicorn",
    "Linux deployment",
    "Reverse proxy",
    "Nginx",
    "Docker deployment",
  ]],
  ["docker", "Docker", [
    "Docker basics",
    "Dockerizing FastAPI",
    "Docker Compose",
    "Multi-container apps",
  ]],
  ["ci-cd", "CI/CD", ["GitHub Actions", "Automated testing", "Automated deployment"]],
  ["monitoring-observability", "Monitoring & Observability", [
    "Health checks",
    "Metrics",
    "Prometheus",
    "Grafana",
    "Error tracking",
  ]],
  ["performance-optimization", "Performance Optimization", [
    "Async optimization",
    "Database optimization",
    "Response compression",
    "Profiling",
  ]],
  ["microservices", "Microservices", [
    "Service communication",
    "API gateways",
    "Distributed systems basics",
  ]],
  ["graphql-with-fastapi", "GraphQL with FastAPI", [
    "GraphQL basics",
    "Strawberry GraphQL",
    "Queries & mutations",
  ]],
  ["advanced-fastapi", "Advanced FastAPI", [
    "Lifespan events",
    "Startup/shutdown events",
    "Custom response classes",
    "Streaming responses",
    "Dependency overrides",
    "Advanced OpenAPI customization",
  ]],
];

function slugifyTitle(title) {
  return title
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[./]/g, " ")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function lessonId(sectionId, title) {
  return `${sectionId}-${slugifyTitle(title)}`;
}

function yaml(value) {
  return JSON.stringify(value);
}

/** Turn markdown fences into CodeExample components (Copy + Run + line numbers). */
function isBrowserRunnable(lang, code) {
  if (lang === "bash") return true;
  return !/\b(fastapi|uvicorn|starlette|sqlalchemy|sqlmodel|alembic|celery|redis|httpx)\b/i.test(
      code,
    ) && !/@app\.|APIRouter|TestClient|Depends\(|BackgroundTasks|WebSocket/.test(code);
}

function convertCodeFencesToComponents(body) {
  return body.replace(/```(python|bash)\n([\s\S]*?)```/g, (_, lang, code) => {
    const filename = lang === "bash" ? "terminal.sh" : "main.py";
    const runnable = isBrowserRunnable(lang, code);
    const escaped = code
      .trim()
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\$\{/g, "\\${");
    return `<CodeExample language="${lang}" filename="${filename}" runnable={${runnable}} code={\`${escaped}\`} />`;
  });
}

/** Escape curly braces in prose so MDX does not treat `{var}` as JSX. Skips CodeExample. */
function escapeMdxBody(body) {
  const parts = body.split(/(<CodeExample[\s\S]*?\/>)/g);
  return parts
    .map((part) => {
      if (part.startsWith("<CodeExample")) return part;
      return part.replace(/\{/g, "&#123;").replace(/\}/g, "&#125;");
    })
    .join("");
}

function prepareMdxBody(body) {
  return escapeMdxBody(convertCodeFencesToComponents(body));
}

function buildMdx({
  title,
  order,
  sectionId,
  sectionTitle,
  sectionOrder,
  lessonOrder,
  content,
}) {
  const quickAnswerLine = content.quickAnswer
    ? `quickAnswer: ${yaml(content.quickAnswer)}\n`
    : "";

  return `---
title: ${yaml(title)}
description: ${yaml(content.description)}
${quickAnswerLine}order: ${order}
sectionId: ${yaml(sectionId)}
sectionTitle: ${yaml(sectionTitle)}
sectionOrder: ${sectionOrder}
lessonOrder: ${lessonOrder}
level: beginner
---

${prepareMdxBody(content.body)}
`;
}

fs.mkdirSync(lessonsDir, { recursive: true });

/** @type {import('../src/lib/fastapi-roadmap/types.ts').FastapiRoadmapSection[]} */
const sections = [];
let globalOrder = 0;

for (let sectionOrder = 0; sectionOrder < RAW.length; sectionOrder++) {
  const [id, title, lessonTitles, example] = RAW[sectionOrder];
  const lessons = lessonTitles.map((lessonTitle, lessonIndex) => {
    globalOrder += 1;
    const lid = lessonId(id, lessonTitle);
    const nextTitle = lessonTitles[lessonIndex + 1] ?? null;
    const content = getLessonContent(id, lessonTitle, {
      sectionId: id,
      sectionTitle: title,
      lessonOrder: lessonIndex + 1,
      globalOrder,
      nextLessonTitle: nextTitle,
    });
    const mdx = buildMdx({
      title: lessonTitle,
      order: globalOrder,
      sectionId: id,
      sectionTitle: title,
      sectionOrder: sectionOrder + 1,
      lessonOrder: lessonIndex + 1,
      content,
    });
    fs.writeFileSync(path.join(lessonsDir, `${lid}.mdx`), mdx);
    return { id: lid, title: lessonTitle };
  });

  const section = { id, title, lessons };
  if (example) section.example = example;
  sections.push(section);
}

const lines = [
  'import type { FastapiRoadmapSection } from "./types";',
  "",
  "/** Auto-generated by npm run generate:fastapi-lessons — do not edit by hand */",
  "export const FASTAPI_ROADMAP_SECTIONS: FastapiRoadmapSection[] = [",
];
for (const section of sections) {
  lines.push("  {");
  lines.push(`    id: ${JSON.stringify(section.id)},`);
  lines.push(`    title: ${JSON.stringify(section.title)},`);
  lines.push(
    `    lessons: [\n${section.lessons.map((l) => `      { id: ${JSON.stringify(l.id)}, title: ${JSON.stringify(l.title)} },`).join("\n")}\n    ],`,
  );
  if (section.example) lines.push(`    example: ${JSON.stringify(section.example)},`);
  lines.push("  },");
}
lines.push("];", "");
fs.writeFileSync(sectionsOut, lines.join("\n"));
console.log(`Generated ${globalOrder} lessons in ${lessonsDir}`);
console.log(`Updated ${sectionsOut}`);
