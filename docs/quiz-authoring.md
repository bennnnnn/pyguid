# Quiz authoring

Chapter quizzes live in `src/data/quizzes/chapter-{n}.json` and render at `/python/quiz/{topic-slug}/`.

## Spreadsheet columns → JSON fields

| Column                    | JSON field                  | Notes                                                                 |
| ------------------------- | --------------------------- | --------------------------------------------------------------------- |
| **Question**              | `prompt`                    | Supports Markdown-style newlines in strings (`\n`)                    |
| **Choices**               | `options`                   | Array of strings; omit for `truefalse` (use True/False UI)            |
| **Correct answer**        | `correctIndex` or `correct` | Choice: 0-based index into `options`. True/false: `true` or `false`   |
| **Explanation**           | `explanation`               | Shown in the results review after submit                              |
| **Related tutorial link** | `lessonSlug`                | Lesson id only (e.g. `list-append`) → links to `/python/list-append/` |

## Question types

### Multiple choice

```json
{
  "id": "1",
  "type": "choice",
  "prompt": "Which function displays text in the terminal?",
  "options": ["print()", "display()", "show()", "output()"],
  "correctIndex": 0,
  "explanation": "print() sends values to standard output.",
  "lessonSlug": "first-print"
}
```

### True / false

```json
{
  "id": "4",
  "type": "truefalse",
  "prompt": "Python runs statements from top to bottom.",
  "correct": true,
  "explanation": "By default, code runs sequentially.",
  "lessonSlug": "top-to-bottom"
}
```

## File-level fields

Each `chapter-{n}.json` file also includes:

- `chapter`, `chapterTitle`, `title`, `description`
- `passPercent` (default 70)
- `questions` (array, typically 20 items)

Topic slugs and chapter numbers are wired in `src/lib/quiz-topics.ts`.
