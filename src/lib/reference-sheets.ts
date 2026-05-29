export type ReferenceCategory = {
  id: string;
  title: string;
  description: string;
};

export const REFERENCE_CATEGORIES: ReferenceCategory[] = [
  {
    id: "basics",
    title: "Basics",
    description: "print(), variables, input(), and reading errors",
  },
  {
    id: "types",
    title: "Types & numbers",
    description: "Built-in types, type(), numbers, and operators",
  },
  {
    id: "strings",
    title: "Strings",
    description: "String literals and common str methods",
  },
  {
    id: "control",
    title: "Control flow",
    description: "Booleans, comparisons, if/else, for, while, and range",
  },
  {
    id: "collections",
    title: "Collections",
    description: "list, tuple, set, and dict syntax and methods",
  },
  {
    id: "functions",
    title: "Functions",
    description: "def, parameters, scope, comprehensions, and decorators",
  },
  {
    id: "classes",
    title: "Classes",
    description: "class, self, methods, inheritance, and magic methods",
  },
  {
    id: "modules",
    title: "Files & modules",
    description: "open(), paths, import, and packages",
  },
  {
    id: "builtins",
    title: "Built-in functions",
    description: "len, range, zip, map, sorted, and related helpers",
  },
  {
    id: "stdlib",
    title: "Standard library",
    description: "json, datetime, pathlib, typing, and more",
  },
  {
    id: "errors",
    title: "Errors & debugging",
    description: "try/except, raise, tracebacks, pdb, and help()",
  },
  {
    id: "tools",
    title: "Testing & tools",
    description: "assert, pytest, ruff, and black",
  },
];

export type ReferenceEntry = {
  /** Plain-language label on entry pages */
  title: string;
  /** Code pattern shown in nav, tables, and examples */
  syntax: string;
  /** Optional stable URL slug; defaults to a slug derived from title */
  slug?: string;
  /** Short description for lookup */
  summary: string;
  /** Optional section heading on the sheet page (e.g. “Basic types”) */
  section?: string;
  /** One-line example (defaults to sheet context if omitted) */
  example?: string;
  /** Full runnable example (auto-generated if omitted) */
  code?: string;
  /** Whether Skulpt Run is shown (default true except shell-only topics) */
  runnable?: boolean;
  filename?: string;
};

export type ReferenceSheet = {
  id: string;
  /** Reference grouping (not tied to tutorial chapters) */
  category: string;
  /** Sheet heading — syntax area, e.g. “Strings” or “Built-in functions” */
  title: string;
  /** Default variable names in auto-generated examples */
  context?: string;
  entries: ReferenceEntry[];
};

export type ReferenceNavGroup = {
  category: ReferenceCategory;
  sheets: ReferenceSheet[];
};

export function getReferenceNav(): ReferenceNavGroup[] {
  return REFERENCE_CATEGORIES.map((category) => ({
    category,
    sheets: REFERENCE_SHEETS.filter((s) => s.category === category.id),
  })).filter((group) => group.sheets.length > 0);
}

export type ReferenceMenuItem = {
  sheetId: string;
  index: number;
  entry: ReferenceEntry;
};

/** Flat entry list (counts, search) — not used for sidebar grouping. */
export function getReferenceMenuItems(): ReferenceMenuItem[] {
  const items: ReferenceMenuItem[] = [];
  for (const sheet of REFERENCE_SHEETS) {
    for (let index = 0; index < sheet.entries.length; index++) {
      items.push({ sheetId: sheet.id, index, entry: sheet.entries[index] });
    }
  }
  return items;
}

export function getReferenceCategory(id: string): ReferenceCategory | undefined {
  return REFERENCE_CATEGORIES.find((c) => c.id === id);
}

export function referenceCategoryContainsSheet(
  categoryId: string,
  sheetId?: string,
): boolean {
  if (!sheetId) return false;
  return REFERENCE_SHEETS.some((s) => s.id === sheetId && s.category === categoryId);
}

export const REFERENCE_SHEETS: ReferenceSheet[] = [
  {
    id: "print-and-errors",
    category: "basics",
    title: "Output, comments & errors",
    context: 'name = "Ada"',
    entries: [
      {
        title: "Show output with print",
        syntax: "print()",
        summary: "Show one or more values on the screen",
        example: 'print("Hi", name)',
      },
      {
        title: "Write a comment",
        syntax: "#",
        summary: "Notes for humans; Python ignores this line",
        example: "# TODO: fix later",
      },
      {
        title: "Understand a SyntaxError",
        syntax: "SyntaxError",
        summary: "Invalid Python grammar (fix spelling, colons, quotes)",
        example: 'print("oops',
      },
      {
        title: "Run a .py file",
        syntax: "python file.py",
        summary: "Save code in a file and run with python file.py",
        example: "python hello.py",
        runnable: false,
      },
      {
        title: "Use the interactive REPL",
        syntax: ">>>",
        summary: "Interactive >>> prompt to try one line at a time",
        example: ">>> 2 + 2",
        runnable: false,
      },
    ],
  },
  {
    id: "variables",
    category: "basics",
    title: "Variables",
    context: "score = 10",
    entries: [
      {
        title: "Create a variable",
        syntax: "name = value",
        summary: "Bind a name to a value",
        example: "score = 10",
      },
      {
        title: "Change a variable's value",
        syntax: "name = name + 1",
        summary: "Update a variable with a new value",
        example: "score = score + 1",
      },
      {
        title: "Assign multiple variables",
        syntax: "a, b = 1, 2",
        summary: "Assign multiple names at once",
        example: "x, y = 1, 2",
      },
      {
        title: "Naming rules (snake_case)",
        syntax: "snake_case",
        summary: "Use lowercase words separated by underscores",
        example: "user_age = 25",
      },
    ],
  },
  {
    id: "input",
    category: "basics",
    title: "input() and type conversion",
    context: 'text = input("Age: ")',
    entries: [
      {
        title: "Read user input",
        syntax: "input()",
        summary: "Read one line of text from the user (always str)",
        example: 'input("Name: ")',
      },
      {
        title: "Convert text to int",
        syntax: "int()",
        summary: "Convert a string to a whole number",
        example: 'int("42")',
      },
      {
        title: "Convert text to float",
        syntax: "float()",
        summary: "Convert a string to a decimal number",
        example: 'float("3.5")',
      },
      {
        title: "Convert a value to str",
        syntax: "str()",
        summary: "Convert a value to text",
        example: "str(99)",
      },
    ],
  },
  {
    id: "data-types",
    category: "types",
    title: "Data types",
    context: "value = 42",
    entries: [
      {
        title: "Integer",
        syntax: "int",
        section: "Basic types",
        summary: "Whole numbers — counting and indexing",
        example: "x = 42",
      },
      {
        title: "Float",
        syntax: "float",
        section: "Basic types",
        summary: "Numbers with a decimal point",
        example: "x = 3.14",
      },
      {
        title: "String",
        syntax: "str",
        section: "Basic types",
        summary: "Text — characters in quotes",
        example: 'x = "hello"',
      },
      {
        title: "Boolean",
        syntax: "bool",
        section: "Basic types",
        summary: "True or False — yes/no logic",
        example: "x = True",
      },
      {
        title: "List",
        syntax: "list",
        section: "Other types",
        summary: "Ordered, changeable sequence — square brackets",
        example: "items = [1, 2, 3]",
      },
      {
        title: "Tuple",
        syntax: "tuple",
        section: "Other types",
        summary: "Ordered, unchangeable sequence — parentheses",
        example: "point = (10, 20)",
      },
      {
        title: "Dictionary",
        syntax: "dict",
        section: "Other types",
        summary: "Key–value pairs — curly braces",
        example: 'user = {"name": "Ada"}',
      },
      {
        title: "Set",
        syntax: "set",
        section: "Other types",
        summary: "Unordered collection of unique items",
        example: "tags = {1, 2, 3}",
      },
      {
        title: 'None — "no value"',
        syntax: "None",
        section: "Other types",
        summary: "Means no value; test with is None, not ==",
        example: "result = None",
      },
      {
        title: "Check a value's type",
        syntax: "type()",
        section: "Checking types",
        summary: "Return the type of a value",
        example: "type(value)",
      },
      {
        title: "Test type with isinstance",
        syntax: "isinstance()",
        section: "Checking types",
        summary: "Test whether a value is a given type",
        example: "isinstance(value, int)",
      },
    ],
  },
  {
    id: "math-operators",
    category: "types",
    title: "Mathematical operators",
    context: "a, b = 10, 3",
    entries: [
      {
        title: "Addition",
        syntax: "+",
        summary: "Add two numbers",
        example: "a + b",
      },
      {
        title: "Subtraction",
        syntax: "-",
        summary: "Subtract the right number from the left",
        example: "a - b",
      },
      {
        title: "Multiplication",
        syntax: "*",
        summary: "Multiply two numbers",
        example: "a * b",
      },
      {
        title: "Division",
        syntax: "/",
        summary: "Divide (result is a float)",
        example: "a / b",
      },
      {
        title: "Floor division",
        syntax: "//",
        summary: "Floor division (drops the fraction)",
        example: "a // b",
      },
      {
        title: "Remainder (modulo)",
        syntax: "%",
        summary: "Remainder after division",
        example: "a % b",
      },
      {
        title: "Exponents",
        syntax: "**",
        summary: "Exponent (power)",
        example: "2 ** 8",
      },
    ],
  },
  {
    id: "assignment-operators",
    category: "types",
    title: "Assignment operators",
    context: "a = 10",
    entries: [
      {
        title: "Add and assign",
        syntax: "+=",
        summary: "Add to a variable and store the result back",
        example: "a += 1",
      },
      {
        title: "Subtract and assign",
        syntax: "-=",
        summary: "Subtract from a variable and store the result back",
        example: "a -= 1",
      },
      {
        title: "Multiply and assign",
        syntax: "*=",
        summary: "Multiply a variable and store the result back",
        example: "a *= 2",
      },
      {
        title: "Divide and assign",
        syntax: "/=",
        summary: "Divide a variable and store the result back",
        example: "a /= 2",
      },
    ],
  },
  {
    id: "strings",
    category: "strings",
    title: "Strings",
    context: 's = "hello world"',
    entries: [
      {
        title: "Get string length",
        syntax: "len()",
        summary: "Number of characters",
        example: "len(s)",
      },
      {
        title: "Index and slice a string",
        syntax: "s[i] · s[start:stop]",
        summary: "Index one character or slice a range",
        example: "s[0] · s[0:5]",
      },
      {
        title: "Change letter case",
        syntax: ".upper() · .lower()",
        summary: "Change letter case",
        example: "s.upper()",
      },
      {
        title: "Remove extra spaces",
        syntax: ".strip()",
        summary: "Remove leading and trailing whitespace",
        example: "s.strip()",
      },
      {
        title: "Split into parts",
        syntax: ".split()",
        summary: "Split into a list of strings",
        example: "s.split()",
      },
      {
        title: "Split on a delimiter",
        syntax: '.split(",")',
        summary: "Split on a delimiter",
        example: 's.split(",")',
      },
      {
        title: "Join strings together",
        syntax: ".join()",
        summary: "Join a list of strings with a separator",
        example: '"-".join(parts)',
      },
      {
        title: "Replace text",
        syntax: ".replace()",
        summary: "Return a new string with replacements",
        example: 's.replace("l", "L")',
      },
      {
        title: "Search for a substring",
        syntax: ".find()",
        summary: "Index of substring, or -1 if missing",
        example: 's.find("world")',
      },
      {
        title: "Count occurrences",
        syntax: ".count()",
        summary: "How many times a substring appears",
        example: 's.count("l")',
      },
      {
        title: "Check start or end",
        syntax: ".startswith() · .endswith()",
        summary: "Test beginning or end of string",
        example: 's.startswith("he")',
      },
      {
        title: "Check if text is inside",
        syntax: "in",
        summary: "True if substring appears anywhere",
        example: '"ell" in s',
      },
      {
        title: "Build formatted strings",
        syntax: 'f"..."',
        summary: "Formatted string with variables inside braces",
        example: 'f"Hi {name}"',
      },
    ],
  },
  {
    id: "comparison-operators",
    category: "control",
    title: "Comparison operators",
    context: "age = 20",
    entries: [
      {
        title: "Equal to",
        syntax: "==",
        summary: "True when both sides are equal",
        example: "age == 20",
      },
      {
        title: "Not equal to",
        syntax: "!=",
        summary: "True when both sides are different",
        example: "age != 0",
      },
      {
        title: "Less than",
        syntax: "<",
        summary: "True when the left side is smaller",
        example: "age < 30",
      },
      {
        title: "Greater than",
        syntax: ">",
        summary: "True when the left side is larger",
        example: "age > 10",
      },
      {
        title: "Less than or equal",
        syntax: "<=",
        summary: "True when the left side is smaller or equal",
        example: "age <= 20",
      },
      {
        title: "Greater than or equal",
        syntax: ">=",
        summary: "True when the left side is larger or equal",
        example: "age >= 18",
      },
      {
        title: "Test membership (in)",
        syntax: "in",
        summary: "Membership test (works on strings and collections)",
        example: '"a" in "abc"',
      },
      {
        title: "Test same object (is)",
        syntax: "is",
        summary: "Same object identity (use for None)",
        example: "value is None",
      },
    ],
  },
  {
    id: "logical-operators",
    category: "control",
    title: "Logical operators",
    context: "age = 20\nhas_ticket = True",
    entries: [
      {
        title: "Both must be true (and)",
        syntax: "and",
        summary: "True only when every condition is True",
        example: "age >= 18 and has_ticket",
      },
      {
        title: "At least one true (or)",
        syntax: "or",
        summary: "True when at least one condition is True",
        example: "has_ticket or is_member",
      },
      {
        title: "Flip a condition (not)",
        syntax: "not",
        summary: "True when the condition is False, and vice versa",
        example: "not is_member",
      },
    ],
  },
  {
    id: "conditional",
    category: "control",
    title: "Conditional",
    context: "age = 20",
    entries: [
      {
        title: "If",
        syntax: "if cond:",
        summary: "Run a block only when the condition is true",
        example: "if age >= 18:\n    ...",
      },
      {
        title: "Else",
        syntax: "else:",
        summary: "Run when the if condition was false",
        example: "else:\n    ...",
      },
      {
        title: "Else if",
        syntax: "elif cond:",
        summary: "Another test when the if (and any earlier elif) was false — Python spells it elif",
        example: "elif age >= 13:\n    ...",
      },
      {
        title: "Switch",
        syntax: "match",
        summary:
          "Pick one branch by matching a value — like switch in other languages (Python 3.10+). Copy and run locally; the browser runner does not support match yet.",
        example: 'command = "go"',
        code: `command = "go"

match command:
    case "go":
        print("going")
    case "stop":
        print("stopped")
    case _:
        print("unknown")`,
        runnable: false,
      },
    ],
  },
  {
    id: "loops",
    category: "control",
    title: "Loops",
    context: "nums = [1, 2, 3]",
    entries: [
      {
        title: "Repeat with while",
        syntax: "while cond:",
        summary: "Repeat while cond stays true",
        example: "while n > 0:\n    n -= 1",
      },
      {
        title: "Loop over items",
        syntax: "for item in seq:",
        summary: "Run once per item in a sequence",
        example: "for n in nums:\n    print(n)",
      },
      {
        title: "Count with range()",
        syntax: "range(n)",
        summary: "Numbers 0 .. n-1",
        example: "for i in range(3):\n    ...",
      },
      {
        title: "range with start and stop",
        syntax: "range(start, stop)",
        summary: "Numbers from start up to stop-1",
        example: "range(1, 4)",
      },
      {
        title: "Break out of a loop",
        syntax: "break",
        summary: "Leave the innermost loop immediately",
        example: "break",
      },
      {
        title: "Skip to the next iteration",
        syntax: "continue",
        summary: "Skip to the next loop iteration",
        example: "continue",
      },
    ],
  },
  {
    id: "lists",
    category: "collections",
    title: "Lists",
    context: "nums = [1, 2, 3]",
    entries: [
      {
        title: "Create a list",
        syntax: "[ ]",
        summary: "Create a list literal",
        example: "nums = [1, 2, 3]",
      },
      {
        title: "Get list length",
        syntax: "len()",
        summary: "Number of items",
        example: "len(nums)",
      },
      {
        title: "Access by index or slice",
        syntax: "[i] · [a:b]",
        summary: "Get one item or a slice (new list)",
        example: "nums[0] · nums[1:3]",
      },
      {
        title: "Add one item",
        syntax: ".append()",
        summary: "Add one item at the end; returns None",
        example: "nums.append(4)",
      },
      {
        title: "Add many items",
        syntax: ".extend()",
        summary: "Add each element from another iterable",
        example: "nums.extend([4, 5])",
      },
      {
        title: "Insert at a position",
        syntax: ".insert()",
        summary: "Insert an item at an index",
        example: "nums.insert(0, 0)",
      },
      {
        title: "Remove by value",
        syntax: ".remove()",
        summary: "Remove first matching value",
        example: "nums.remove(2)",
      },
      {
        title: "Remove and return an item",
        syntax: ".pop()",
        summary: "Remove and return an item (last, or at index)",
        example: "nums.pop(0)",
      },
      {
        title: "Delete by index",
        syntax: "del[i]",
        summary: "Delete item at index",
        example: "del nums[0]",
      },
      {
        title: "Clear the list",
        syntax: ".clear()",
        summary: "Remove all items",
        example: "nums.clear()",
      },
      {
        title: "Sort in place",
        syntax: ".sort()",
        summary: "Sort list in place",
        example: "nums.sort()",
      },
      {
        title: "Return a sorted copy",
        syntax: "sorted()",
        summary: "Return a new sorted list",
        example: "sorted(nums)",
      },
      {
        title: "Reverse order",
        syntax: ".reverse()",
        summary: "Reverse list in place",
        example: "nums.reverse()",
      },
      {
        title: "Copy a list",
        syntax: ".copy()",
        summary: "Shallow copy of the list",
        example: "other = nums.copy()",
      },
      {
        title: "Find an item's index",
        syntax: ".index()",
        summary: "Index of first matching value",
        example: "nums.index(2)",
      },
      {
        title: "Count occurrences",
        syntax: ".count()",
        summary: "How many times a value appears",
        example: "nums.count(2)",
      },
      {
        title: "Loop with index",
        syntax: "enumerate()",
        summary: "Pairs of index and value in a loop",
        example: "for i, v in enumerate(nums):",
      },
      {
        title: "Pair two lists",
        syntax: "zip()",
        summary: "Pair items from two sequences",
        example: "list(zip(nums, other))",
      },
    ],
  },
  {
    id: "tuples",
    category: "collections",
    title: "Tuples",
    context: "point = (10, 20)",
    entries: [
      {
        title: "Create a tuple",
        syntax: "( )",
        summary: "Ordered, immutable sequence",
        example: "point = (10, 20)",
      },
      {
        title: "Single-item tuple",
        syntax: "(x,)",
        summary: "One-item tuple needs a trailing comma",
        example: "one = (42,)",
      },
      {
        title: "Unpack a tuple",
        syntax: "a, b = tup",
        summary: "Unpack values into names",
        example: "x, y = point",
      },
      {
        title: "Access by index",
        syntax: "tup[i]",
        summary: "Read one item (cannot assign)",
        example: "point[0]",
      },
      {
        title: "Tuple length",
        syntax: "len()",
        summary: "Number of items",
        example: "len(point)",
      },
    ],
  },
  {
    id: "sets",
    category: "collections",
    title: "Sets",
    context: 'tags = {"a", "b"}',
    entries: [
      {
        title: "Create a set",
        syntax: "{ } · set()",
        summary: "Unordered collection of unique items",
        example: 'tags = {"a", "b"}',
      },
      {
        title: "Add an item",
        syntax: ".add()",
        summary: "Add an item",
        example: 'tags.add("c")',
      },
      {
        title: "Remove an item",
        syntax: ".remove()",
        summary: "Remove item (error if missing)",
        example: 'tags.remove("a")',
      },
      {
        title: "Remove safely",
        syntax: ".discard()",
        summary: "Remove item if present (no error)",
        example: 'tags.discard("z")',
      },
      {
        title: "Union of sets",
        syntax: "|",
        summary: "Union — items in either set",
        example: "a | b",
      },
      {
        title: "Intersection",
        syntax: "&",
        summary: "Intersection — items in both",
        example: "a & b",
      },
      {
        title: "Difference",
        syntax: "-",
        summary: "Difference — in a but not b",
        example: "a - b",
      },
      {
        title: "Test membership",
        syntax: "in",
        summary: "Membership test",
        example: '"a" in tags',
      },
    ],
  },
  {
    id: "dictionaries",
    category: "collections",
    title: "Dictionaries",
    context: 'user = {"name": "Ada", "age": 30}',
    entries: [
      {
        title: "Create a dictionary",
        syntax: "{key: value}",
        summary: "Map keys to values",
        example: 'user = {"name": "Ada"}',
      },
      {
        title: "Get value by key",
        syntax: 'dict["key"]',
        summary: "Get value; KeyError if missing",
        example: 'user["name"]',
      },
      {
        title: "Get with a default",
        syntax: ".get()",
        summary: "Get value or default if missing",
        example: 'user.get("role", "guest")',
      },
      {
        title: "List all keys",
        syntax: ".keys()",
        summary: "View of all keys",
        example: "list(user.keys())",
      },
      {
        title: "List all values",
        syntax: ".values()",
        summary: "View of all values",
        example: "list(user.values())",
      },
      {
        title: "Loop key-value pairs",
        syntax: ".items()",
        summary: "View of (key, value) pairs",
        example: "for k, v in user.items():",
      },
      {
        title: "Add or update a key",
        syntax: 'dict["key"] =',
        summary: "Add or update a key",
        example: 'user["age"] = 31',
      },
      {
        title: "Merge dictionaries",
        syntax: ".update()",
        summary: "Merge in keys from another dict",
        example: "user.update(extra)",
      },
      {
        title: "Remove a key",
        syntax: ".pop()",
        summary: "Remove key and return its value",
        example: 'user.pop("age")',
      },
      {
        title: "Set default if missing",
        syntax: ".setdefault()",
        summary: "Set key only if it is missing",
        example: 'user.setdefault("role", "user")',
      },
      {
        title: "Test if key exists",
        syntax: "in",
        summary: "Test whether key exists",
        example: '"name" in user',
      },
    ],
  },
  {
    id: "functions",
    category: "functions",
    title: "Functions",
    context: "def greet(x):",
    entries: [
      {
        title: "Define a function",
        syntax: "def name():",
        summary: "Define a function with no parameters",
        example: "def greet():",
      },
      {
        title: "Add parameters",
        syntax: "def name(x):",
        summary: "Define a function with parameters",
        example: "def greet(x):",
      },
      {
        title: "Default parameter values",
        syntax: "def name(x=0):",
        summary: "Default value when the argument is omitted",
        example: "def add_one(x=0):",
      },
      {
        title: "Return a value",
        syntax: "return",
        summary: "Send a result back to the caller",
        example: "return x",
      },
      {
        title: "Write a docstring",
        syntax: '"""docstring"""',
        summary: "Describe the function on the line under def",
        example: '"""What this does."""',
      },
    ],
  },
  {
    id: "scope",
    category: "functions",
    title: "Scope",
    context: "count = 0",
    entries: [
      {
        title: "Local variables",
        syntax: "x = 1  # inside def",
        summary: "Name assigned inside a function",
        example: "def f():\n    x = 1",
      },
      {
        title: "Module-level names",
        syntax: "count = 0",
        summary: "Module-level name visible outside functions",
        example: "count = 0",
      },
      {
        title: "Modify global from a function",
        syntax: "global",
        summary: "Assign to a module-level name inside a function",
        example: "global count",
      },
      {
        title: "Modify enclosing scope",
        syntax: "nonlocal",
        summary: "Assign in enclosing (not global) scope",
        example: "nonlocal total",
      },
    ],
  },
  {
    id: "errors",
    category: "errors",
    title: "Error Handling",
    context: "try:\n    ...",
    entries: [
      {
        title: "Try risky code",
        syntax: "try:",
        summary: "Start a block that might fail",
        example: "try:\n    n = int(text)",
      },
      {
        title: "Catch an exception",
        syntax: "except:",
        summary: "Handle a specific error type",
        example: "except ValueError:\n    ...",
      },
      {
        title: "Catch and name the error",
        syntax: "except as:",
        summary: "Catch error and bind message to a name",
        example: "except Exception as e:",
      },
      {
        title: "Run when try succeeds",
        syntax: "else:",
        summary: "Run if try succeeded (no exception)",
        example: "else:\n    print(ok)",
      },
      {
        title: "Always run cleanup",
        syntax: "finally:",
        summary: "Always run (cleanup)",
        example: "finally:\n    close()",
      },
      {
        title: "Raise an exception",
        syntax: "raise",
        summary: "Raise your own exception",
        example: 'raise ValueError("bad")',
      },
    ],
  },
  {
    id: "files",
    category: "modules",
    title: "Files",
    context: 'path = "notes.txt"',
    entries: [
      {
        title: "Open for reading",
        syntax: 'open("r")',
        summary: "Open a file for reading text",
        example: 'open("data.txt", "r")',
      },
      {
        title: "Open for writing",
        syntax: 'open("w")',
        summary: "Open for writing (overwrites)",
        example: 'open("out.txt", "w")',
      },
      {
        title: "Open for appending",
        syntax: 'open("a")',
        summary: "Open for appending at end",
        example: 'open("log.txt", "a")',
      },
      {
        title: "Read entire file",
        syntax: ".read()",
        summary: "Read entire file as one string",
        example: "text = f.read()",
      },
      {
        title: "Read as lines",
        syntax: ".readlines()",
        summary: "Read lines into a list of strings",
        example: "lines = f.readlines()",
      },
      {
        title: "Write text",
        syntax: ".write()",
        summary: "Write a string to the file",
        example: 'f.write("line\\n")',
      },
      {
        title: "Auto-close with with",
        syntax: "with open():",
        summary: "Auto-close file when block ends",
        example: "with open(path) as f:",
      },
      {
        title: "Work with Path objects",
        syntax: "Path()",
        summary: "pathlib path object (join, exists, read)",
        example: 'Path("data") / "file.txt"',
      },
    ],
  },
  {
    id: "modules",
    category: "modules",
    title: "Modules",
    context: "import math",
    entries: [
      {
        title: "Import a module",
        syntax: "import",
        summary: "Load a module under its name",
        example: "import math",
      },
      {
        title: "Import one name",
        syntax: "from ... import",
        summary: "Import one name from a module",
        example: "from math import sqrt",
      },
      {
        title: "Import with an alias",
        syntax: "import ... as",
        summary: "Import with a shorter local name",
        example: "import datetime as dt",
      },
      {
        title: "Run as script guard",
        syntax: '__name__ == "__main__"',
        summary: "True when file is run directly",
        example: 'if __name__ == "__main__":',
      },
      {
        title: "Command-line arguments",
        syntax: "sys.argv",
        summary: "Command-line arguments as strings",
        example: "import sys",
      },
    ],
  },
  {
    id: "packages",
    category: "modules",
    title: "Packages and Imports",
    context: "python -m venv .venv",
    entries: [
      {
        title: "Create a virtual environment",
        syntax: "python -m venv",
        summary: "Create a virtual environment",
        example: "python -m venv .venv",
      },
      {
        title: "Install a package",
        syntax: "pip install",
        summary: "Install a package into active env",
        example: "pip install requests",
      },
      {
        title: "Install from requirements.txt",
        syntax: "pip install -r requirements.txt",
        summary: "List pinned dependencies for a project",
        example: "pip install -r requirements.txt",
      },
    ],
  },
  {
    id: "builtins",
    category: "builtins",
    title: "Built-in functions",
    context: "nums = [3, 1, 4]",
    entries: [
      {
        title: "Get length",
        syntax: "len()",
        summary: "Used to count the number of items in a sequence or collection.",
        example: "len(nums)",
      },
      {
        title: "Sum numbers",
        syntax: "sum()",
        summary: "Add numeric items",
        example: "sum(nums)",
      },
      {
        title: "Find min or max",
        syntax: "min() · max()",
        summary: "Smallest or largest item",
        example: "min(nums)",
      },
      {
        title: "Return sorted copy",
        syntax: "sorted()",
        summary: "New sorted list from iterable",
        example: "sorted(nums)",
      },
      {
        title: "Enumerate with index",
        syntax: "enumerate()",
        summary: "Index and value pairs",
        example: "list(enumerate(nums))",
      },
      {
        title: "Zip sequences together",
        syntax: "zip()",
        summary: "Pair items from iterables",
        example: "list(zip(a, b))",
      },
      {
        title: "Test any or all",
        syntax: "any() · all()",
        summary: "True if any / all items are truthy",
        example: "any(nums)",
      },
      {
        title: "Check type with isinstance",
        syntax: "isinstance()",
        summary: "Type check",
        example: "isinstance(nums, list)",
      },
    ],
  },
  {
    id: "comprehensions",
    category: "functions",
    title: "Comprehensions",
    context: "nums = [1, 2, 3, 4]",
    entries: [
      {
        title: "Build a list",
        syntax: "[x for x in seq]",
        summary: "Build a new list in one expression",
        example: "[n * 2 for n in nums]",
      },
      {
        title: "Filter while building",
        syntax: "[x for x in seq if ...]",
        summary: "List comp with a filter",
        example: "[n for n in nums if n % 2 == 0]",
      },
      {
        title: "Build a dict",
        syntax: "{k: v for ...}",
        summary: "Build a new dictionary",
        example: "{k: len(k) for k in keys}",
      },
      {
        title: "Build a set",
        syntax: "{x for x in seq}",
        summary: "Build a set of unique values",
        example: "{n % 2 for n in nums}",
      },
    ],
  },
  {
    id: "classes",
    category: "classes",
    title: "Classes (OOP)",
    context: "class Dog:\n    ...",
    entries: [
      {
        title: "Define a class",
        syntax: "class Name:",
        summary: "Define a new type",
        example: "class Dog:",
      },
      {
        title: "Initialize instances",
        syntax: "def __init__():",
        summary: "Constructor; set up instance",
        example: "def __init__(self, name):",
      },
      {
        title: "Store instance data",
        syntax: "self.",
        summary: "Instance attribute",
        example: "self.name = name",
      },
      {
        title: "Define a method",
        syntax: "def method():",
        summary: "Behavior on an instance",
        example: "def bark(self):",
      },
      {
        title: "Create an instance",
        syntax: "Class()",
        summary: "Create an instance",
        example: 'buddy = Dog("Max")',
      },
      {
        title: "Inherit from a parent",
        syntax: "class Child(Parent):",
        summary: "Inherit from another class",
        example: "class Puppy(Dog):",
      },
      {
        title: "Call parent methods",
        syntax: "super()",
        summary: "Call parent implementation",
        example: "super().__init__(name)",
      },
      {
        title: "String representation",
        syntax: "__str__ · __repr__",
        summary: "String forms for print and debugging",
        example: "def __str__(self):",
      },
    ],
  },
  {
    id: "advanced-functions",
    category: "functions",
    title: "Advanced function syntax",
    context: "def f(*args, **kwargs):",
    entries: [
      {
        title: "Variable positional args",
        syntax: "*args",
        summary: "Collect extra positional arguments as tuple",
        example: "def f(*args):",
      },
      {
        title: "Variable keyword args",
        syntax: "**kwargs",
        summary: "Collect extra keyword arguments as dict",
        example: "def f(**kwargs):",
      },
      {
        title: "Small anonymous function",
        syntax: "lambda:",
        summary: "Small anonymous function",
        example: "lambda x: x * 2",
      },
      {
        title: "Cache results",
        syntax: "@lru_cache",
        summary: "Cache return values by arguments",
        example: "@lru_cache",
      },
    ],
  },
  {
    id: "iterators",
    category: "stdlib",
    title: "Iterators and Generators",
    context: "nums = [1, 2, 3]",
    entries: [
      {
        title: "Get an iterator",
        syntax: "iter()",
        summary: "Get an iterator from an iterable",
        example: "it = iter(nums)",
      },
      {
        title: "Get the next value",
        syntax: "next()",
        summary: "Next value from iterator",
        example: "next(it)",
      },
      {
        title: "Create a generator",
        syntax: "yield",
        summary: "Generator function; lazy sequence",
        example: "yield n",
      },
      {
        title: "When iteration ends",
        syntax: "StopIteration",
        summary: "Iterator has no more items",
        example: "next(it)  # raises",
      },
    ],
  },
  {
    id: "decorators",
    category: "functions",
    title: "Decorators",
    context: "@timer\ndef work():",
    entries: [
      {
        title: "Apply a decorator",
        syntax: "@decorator",
        summary: "Wrap a function to add behavior",
        example: "@decorator\ndef f():",
      },
      {
        title: "def decorator():",
        syntax: "def decorator():",
        summary: "Outer function receives original",
        example: "def wrap(*a, **k):",
      },
      {
        title: "Property getter",
        syntax: "@property",
        summary: "Method accessed like an attribute",
        example: "@property\ndef age(self):",
      },
    ],
  },
  {
    id: "type-hints",
    category: "stdlib",
    title: "Type Hints",
    context: "def greet(name: str) -> str:",
    entries: [
      {
        title: "Annotate parameters",
        syntax: ": str",
        summary: "Annotate a parameter type",
        example: "def f(x: int):",
      },
      {
        title: "Annotate return type",
        syntax: "-> str",
        summary: "Annotate return type",
        example: "def f() -> str:",
      },
      {
        title: "Annotate collections",
        syntax: "list[int]",
        summary: "Generic collection types (3.9+)",
        example: "nums: list[int]",
      },
      {
        title: "Optional values",
        syntax: "Optional[]",
        summary: "Value or None",
        example: "from typing import Optional",
      },
      {
        title: "Run mypy checker",
        syntax: "mypy",
        summary: "Optional static type checker",
        example: "mypy app.py",
      },
    ],
  },
  {
    id: "stdlib",
    category: "stdlib",
    title: "Standard library modules",
    context: "import json",
    entries: [
      {
        title: "Parse JSON",
        syntax: "json.loads()",
        summary: "Parse JSON string to Python",
        example: "json.loads('{\"a\":1}')",
      },
      {
        title: "Serialize to JSON",
        syntax: "json.dumps()",
        summary: "Python to JSON string",
        example: "json.dumps(data)",
      },
      {
        title: "Current date and time",
        syntax: "datetime.now()",
        summary: "Current date and time",
        example: "from datetime import datetime",
      },
      {
        title: "Log messages",
        syntax: "logging.info()",
        summary: "Write a log message",
        example: 'logging.info("ok")',
      },
      {
        title: "Regular expressions",
        syntax: "re.search()",
        summary: "Find regex match in string",
        example: 're.search(r"\\d+", s)',
      },
      {
        title: "Deep copy nested data",
        syntax: "copy.deepcopy()",
        summary: "Full copy of nested structures",
        example: "copy.deepcopy(nested)",
      },
    ],
  },
  {
    id: "debugging",
    category: "errors",
    title: "Debugging Python Code",
    context: "import pdb",
    entries: [
      {
        title: "Get help on an object",
        syntax: "help()",
        summary: "Interactive documentation in the shell",
        example: "help(list.append)",
      },
      {
        title: "List attributes",
        syntax: "dir()",
        summary: "List attribute names on an object",
        example: "dir([])",
      },
      {
        title: "Pause at a breakpoint",
        syntax: "breakpoint()",
        summary: "Pause and inspect at this line",
        example: "breakpoint()",
      },
      {
        title: "Read a traceback",
        syntax: "traceback",
        summary: "Error report: read last line first",
        example: "# see terminal output",
      },
    ],
  },
  {
    id: "testing",
    category: "tools",
    title: "Testing Python Code",
    context: "def add(a, b): return a + b",
    entries: [
      {
        title: "Assert a condition",
        syntax: "assert",
        summary: "Crash if condition is false",
        example: "assert add(1, 2) == 3",
      },
      {
        title: "Run pytest",
        syntax: "pytest",
        summary: "Run tests in test_*.py files",
        example: "pytest",
      },
      {
        title: "Write a test function",
        syntax: "def test_():",
        summary: "pytest discovers functions starting with test_",
        example: "def test_add():",
      },
    ],
  },
  {
    id: "clean-code",
    category: "tools",
    title: "Code quality tools",
    context: "ruff check .",
    entries: [
      {
        title: "Lint with ruff",
        syntax: "ruff check",
        summary: "Lint for style and common bugs",
        example: "ruff check .",
      },
      {
        title: "Format with black",
        syntax: "black",
        summary: "Auto-format code to one style",
        example: "black src/",
      },
      {
        title: "Follow PEP 8",
        syntax: "PEP 8",
        summary: "Python style guide (naming, spacing)",
        example: "# snake_case names",
      },
    ],
  },
];

export type ReferenceEntryPage = {
  sheet: ReferenceSheet;
  entry: ReferenceEntry;
  slug: string;
  index: number;
};

const entrySlugsBySheet = new Map<string, string[]>();

const ENTRY_SLUG_ALIASES: Record<string, string> = {
  "[ ]": "list-literal",
  "( )": "tuple-literal",
  "( ,)": "tuple-one",
  "{ } · set()": "set-literal",
  "{key: value}": "dict-literal",
  '["key"]': "dict-key",
  "[key] =": "dict-assign",
  "[i] · [a:b]": "index-slice",
  "[i] · [start:stop]": "index-slice",
  ".upper() · .lower()": "upper-lower",
  ".startswith() · .endswith()": "startswith-endswith",
  "min() · max()": "min-max",
  "any() · all()": "any-all",
  "==": "eq",
  "!=": "ne",
  "<": "lt",
  ">": "gt",
  "<=": "lte",
  ">=": "gte",
  "==  !=  <  >  <=  >=": "gte",
  "== != < > <= >=": "gte",
  "and · or · not": "and-or-not",
  "+": "add",
  "-": "subtract",
  "*": "multiply",
  "/": "divide",
  "+  -  *  /": "add",
  "+ - * /": "add",
  "+=  -=  *=": "augmented-assign",
  int: "int",
  float: "float",
  str: "str",
  bool: "bool",
  list: "list",
  tuple: "tuple",
  dict: "dict",
  set: "set",
  "int · float · str · bool": "int",
  "True · False": "true-false",
  "def(x=)": "def-default",
  "def(x)": "def-param",
  "def name():": "def",
  "def name(x):": "def-param",
  "def name(x=0):": "def-default",
  "class Name:": "class",
  "class Child(Parent):": "inheritance",
  "name = value": "assign",
  "name = name + 1": "reassign",
  "a, b = 1, 2": "unpack-assign",
  "python file.py": "run-py-file",
  ">>>": "repl",
  "#": "comment",
  "print()": "print",
  "input()": "input",
  "while cond:": "while",
  "for item in seq:": "for",
  "range(n)": "range",
  "range(start, stop)": "range-args",
  "if cond:": "if",
  "elif cond:": "elif",
  "else:": "else",
  "elif cond:": "elif",
  match: "switch",
  'f"..."': "fstring",
  "from ... import": "from-import",
  "import ... as": "import-as",
  "a, b = tup": "tuple-unpack",
  "tup[i]": "tuple-index",
  "del[i]": "del-item",
};

/** Short noun-style slug from syntax label (W3Schools-style lookup URLs). */
function slugFromSyntax(syntax: string): string | null {
  const s = syntax.trim();
  if (ENTRY_SLUG_ALIASES[s]) return ENTRY_SLUG_ALIASES[s];

  const methodOnly = s.match(/^\.([a-z_]+)\(\)$/i);
  if (methodOnly) return methodOnly[1].toLowerCase();

  const fnCall = s.match(/^([a-z_][\w]*)\(\)$/i);
  if (fnCall) return fnCall[1].toLowerCase();

  if (/^for\s+.+\s+in\s+/i.test(s)) return "for";
  if (/^while\b/i.test(s)) return "while";
  if (/^if\b/i.test(s)) return "if";
  if (/^elif\b/i.test(s)) return "elif";
  if (/^else\b/i.test(s)) return "else";
  if (/^def\b/i.test(s))
    return s.includes("=") ? "def-default" : s.includes("(") ? "def" : "def";
  if (/^class\b/i.test(s)) return s.includes("(") ? "inheritance" : "class";
  if (/^try\b/i.test(s)) return "try";
  if (/^except\b/i.test(s)) return "except";
  if (/^finally\b/i.test(s)) return "finally";
  if (/^raise\b/i.test(s)) return "raise";
  if (/^with\b/i.test(s)) return "with";
  if (/^import\b/i.test(s)) return "import-as";
  if (/^from\b/i.test(s)) return "from-import";
  if (s.startsWith("del")) return "del-item";

  if (s === "break") return "break";
  if (s === "continue") return "continue";
  if (s === "pass") return "pass";
  if (s === "return") return "return";
  if (s === "yield") return "yield";
  if (s === "lambda") return "lambda";
  if (s === "None") return "none";
  if (s === "in") return "in";
  if (s === "is") return "is";
  if (s === "+") return "add";
  if (s === "-") return "subtract";
  if (s === "*") return "multiply";
  if (s === "/") return "divide";
  if (s === "//") return "floor-div";
  if (s === "%") return "modulo";
  if (s === "**") return "power";
  if (s === "+=") return "plus-eq";
  if (s === "-=") return "minus-eq";
  if (s === "*=") return "star-eq";
  if (s === "/=") return "slash-eq";
  if (s === "|") return "or-set";
  if (s === "&") return "and-set";
  if (s === "-") return "diff-set";

  if (/^[A-Z][a-zA-Z]*Error$/.test(s)) {
    return s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }

  if (/^[a-z_][\w]*$/.test(s)) return s.replace(/_/g, "-");

  return null;
}

function slugifyEntryName(name: string): string {
  let s = name.trim().toLowerCase();
  s = s.replace(/[·]/g, "-");
  s = s.replace(/\([^)]*\)/g, "");
  s = s.replace(/[()]/g, "");
  s = s.replace(/\./g, "");
  s = s.replace(/['']/g, "");
  s = s.replace(/[^\w-]+/g, "-");
  s = s.replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  if (!s) return "syntax";
  return s;
}

function entrySlugBase(entry: ReferenceEntry): string {
  if (entry.slug) return entry.slug;
  const fromSyntax = slugFromSyntax(entry.syntax);
  if (fromSyntax) return fromSyntax;
  return slugifyEntryName(entry.title);
}

function buildEntrySlugs(sheet: ReferenceSheet): string[] {
  const counts = new Map<string, number>();
  return sheet.entries.map((entry) => {
    const base = entrySlugBase(entry);
    const seen = counts.get(base) ?? 0;
    counts.set(base, seen + 1);
    return seen === 0 ? base : `${base}-${seen + 1}`;
  });
}

function getSheetEntrySlugs(sheetId: string): string[] {
  if (!entrySlugsBySheet.has(sheetId)) {
    const sheet = REFERENCE_SHEETS.find((s) => s.id === sheetId);
    if (!sheet) return [];
    entrySlugsBySheet.set(sheetId, buildEntrySlugs(sheet));
  }
  return entrySlugsBySheet.get(sheetId) ?? [];
}

export function referenceEntrySlug(sheetId: string, index: number): string {
  return getSheetEntrySlugs(sheetId)[index] ?? `item-${index}`;
}

/** Topic page — one reference page per syntax area (Variables, Strings, …). */
export function referenceSheetUrl(sheetId: string): string {
  return `/python/reference/${sheetId}/`;
}

export function referenceChapterUrl(sheetId: string): string {
  return referenceSheetUrl(sheetId);
}

export function referenceEntryUrl(sheetId: string, entrySlug: string): string {
  return `/python/reference/${sheetId}/${entrySlug}/`;
}

/** @deprecated Use referenceSheetUrl — topic pages replace “first entry” navigation. */
export function referenceFirstEntryUrl(sheetId: string): string {
  return referenceSheetUrl(sheetId);
}

export function referenceSheetHubUrl(sheetId: string): string {
  return referenceSheetUrl(sheetId);
}

/** Deep link to one item on a topic page. */
export function referenceSheetAnchorUrl(sheetId: string, entrySlug: string): string {
  return `${referenceSheetUrl(sheetId)}#${entrySlug}`;
}

/** Per-entry URLs → anchor on the group (sheet) page. */
export function buildReferenceEntryToSheetRedirects(): Record<string, string> {
  const redirects: Record<string, string> = {};
  for (const sheet of REFERENCE_SHEETS) {
    const slugs = buildEntrySlugs(sheet);
    sheet.entries.forEach((_entry, index) => {
      const slug = slugs[index];
      if (slug) {
        redirects[referenceEntryUrl(sheet.id, slug)] = referenceSheetAnchorUrl(
          sheet.id,
          slug,
        );
      }
    });
  }
  return redirects;
}

export function getAdjacentReferenceSheets(sheetId: string): {
  prev?: ReferenceSheet;
  next?: ReferenceSheet;
} {
  const index = REFERENCE_SHEETS.findIndex((s) => s.id === sheetId);
  if (index < 0) return {};
  return {
    prev: index > 0 ? REFERENCE_SHEETS[index - 1] : undefined,
    next: index < REFERENCE_SHEETS.length - 1 ? REFERENCE_SHEETS[index + 1] : undefined,
  };
}

export function getAdjacentReferencePages(page: ReferenceEntryPage): {
  prev?: { sheetId: string; slug: string; name: string };
  next?: { sheetId: string; slug: string; name: string };
} {
  const all = getAllReferenceEntryPages();
  const index = all.findIndex(
    (p) => p.sheet.id === page.sheet.id && p.slug === page.slug,
  );
  if (index < 0) return {};
  const prevPage = index > 0 ? all[index - 1] : undefined;
  const nextPage = index < all.length - 1 ? all[index + 1] : undefined;
  return {
    prev: prevPage
      ? {
          sheetId: prevPage.sheet.id,
          slug: prevPage.slug,
          name: prevPage.entry.syntax,
        }
      : undefined,
    next: nextPage
      ? {
          sheetId: nextPage.sheet.id,
          slug: nextPage.slug,
          name: nextPage.entry.syntax,
        }
      : undefined,
  };
}

export function buildReferenceSheetIndexRedirects(): Record<string, string> {
  return {};
}

export function getAllReferenceEntryPages(): ReferenceEntryPage[] {
  const pages: ReferenceEntryPage[] = [];
  for (const sheet of REFERENCE_SHEETS) {
    const slugs = buildEntrySlugs(sheet);
    entrySlugsBySheet.set(sheet.id, slugs);
    sheet.entries.forEach((entry, index) => {
      pages.push({ sheet, entry, slug: slugs[index], index });
    });
  }
  return pages;
}

export function getReferenceEntryPage(
  sheetId: string,
  entrySlug: string,
): ReferenceEntryPage | undefined {
  const sheet = getReferenceSheet(sheetId);
  if (!sheet) return undefined;
  const slugs = getSheetEntrySlugs(sheetId);
  const index = slugs.indexOf(entrySlug);
  if (index < 0) return undefined;
  return { sheet, entry: sheet.entries[index], slug: entrySlug, index };
}

export function parseReferencePath(pathname: string): {
  sheetId?: string;
  entrySlug?: string;
} {
  const entryMatch = pathname.match(/\/python\/reference\/([^/]+)\/([^/]+)\/?$/);
  if (entryMatch) {
    return { sheetId: entryMatch[1], entrySlug: entryMatch[2] };
  }
  const chapterMatch = pathname.match(/\/python\/reference\/([^/]+)\/?$/);
  if (chapterMatch && chapterMatch[1] !== "reference") {
    return { sheetId: chapterMatch[1] };
  }
  return {};
}

export function getReferenceSheet(id: string): ReferenceSheet | undefined {
  return REFERENCE_SHEETS.find((s) => s.id === id);
}
