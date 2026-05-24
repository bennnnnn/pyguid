# PyGuide: Python-only vision

## What “L4-level Python developer” means here

An **L4-level Python developer** on PyGuide is someone who **deeply understands Python itself** and can write **clean, correct, readable** programs — not someone who has deployed FastAPI, configured CI, or shipped a full-stack app on this site.

That means the course goes deep on **pure Python**:

- variables, data types, operators, control flow  
- strings, lists, tuples, sets, dictionaries  
- functions, scope, errors, files  
- modules, packages, OOP, dunder methods  
- iterators, generators, decorators, comprehensions  
- typing basics, standard library, testing basics, debugging, clean code  

**Out of scope for the main Python course** (separate tracks later):

- FastAPI, Flask, HTTP clients, async web stacks  
- databases (SQLite, ORM) as a course chapter  
- deployment, GitHub Actions, PyPI publishing  
- “capstone” / full-stack backend framing  

## Site positioning

> The cleanest **Python-only** learning site: easy enough for a beginner, deep enough for serious Python mastery.

**Not:** Python + FastAPI + backend + deployment + GitHub in one menu.

**Master Python first.** Frameworks and ops get their own section when we build them.

## Target chapter roadmap (30 chapters)

Granular, Python-only outline — **implemented in `curriculum-order.json` v11** (31 chapters including mini programs):

| Ch | Title |
|----|--------|
| 1 | What is Python? |
| 2 | Print, Comments, and Errors |
| 3 | Variables |
| 4 | Input and Type Conversion |
| 5 | Data Types |
| 6 | Numbers and Operators |
| 7 | Strings |
| 8 | Booleans and Conditions |
| 9 | Loops |
| 10 | Lists |
| 11 | Tuples |
| 12 | Sets |
| 13 | Dictionaries |
| 14 | Functions |
| 15 | Scope |
| 16 | Error Handling |
| 17 | Files |
| 18 | Modules |
| 19 | Packages and Imports |
| 20 | Useful Built-in Functions |
| 21 | Comprehensions |
| 22 | Object-Oriented Python |
| 23 | Advanced Functions |
| 24 | Iterators and Generators |
| 25 | Decorators |
| 26 | Type Hints |
| 27 | Python Standard Library |
| 28 | Debugging Python Code |
| 29 | Testing Python Code |
| 30 | Writing Clean Python |

**Python Mini Programs** (not “capstone”): small apply-what-you-learn scripts (name formatter, calculator, guessing game, shopping list, contact book, word counter, notes file, grade checker) — woven into chapters or grouped, never framed as deployment projects.

## Three learning surfaces

| Surface | URL | Purpose |
|---------|-----|---------|
| **Tutorials** | `/python/` | Lessons: explain → runnable examples → mistakes → recap |
| **Quizzes** | `/python/quiz/` | Chapter/topic quizzes (20 Q, scored) — **separate from lesson pages** |
| **References** | `/python/reference/` | Fast syntax and behavior lookup |

No Practice hub. No FastAPI, Git, databases, or deployment in the main course.

Lesson pages use a minimal footer:

- **Back** / **Next tutorial →** (global lesson order)

Quizzes and references live on their own sections (`/python/quiz/`, `/python/reference/`), not in the lesson footer.

## SEO (Python-only cluster)

Target intent like: `python variables`, `python list append`, `python append vs extend`, `python try except`, `python decorators`, `python type hints` — **not** FastAPI keywords in this course.

## Implementation priorities

1. Fix build issues  
2. Format repo  
3. Lock Python-only curriculum (`docs/curriculum-order.json` + archive)  
4. Nav: **Tutorials · Quizzes · References** only  
5. Deepen each tutorial lesson  
6. SEO metadata + FAQ on reference pages  
7. Advanced pure-Python chapters (split/rename toward 30-chapter map)  
8. **Python Mini Programs** — small programs, not capstones  

## Archive policy

Lessons under `src/archive/lessons/` are **not** in `curriculum-order.json` and are not published. Restore by moving back to `src/content/lessons/` and re-adding to the curriculum, then `npm run sync:curriculum`.
