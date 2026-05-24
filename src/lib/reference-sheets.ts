export type ReferenceEntry = {
  /** Syntax or name shown in the first column */
  name: string;
  /** Short description for lookup */
  summary: string;
  /** One-line example (defaults to chapter context if omitted) */
  example?: string;
  /** Full runnable example (auto-generated if omitted) */
  code?: string;
  /** Whether Skulpt Run is shown (default true except shell-only topics) */
  runnable?: boolean;
  filename?: string;
};

export type ReferenceSheet = {
  id: string;
  chapter: number;
  title: string;
  /** Shown under the heading — sets default variable names in examples */
  context?: string;
  entries: ReferenceEntry[];
};

export const REFERENCE_SHEETS: ReferenceSheet[] = [
  {
    id: "what-is-python",
    chapter: 1,
    title: "What is Python?",
    context: 'print("Hello")',
    entries: [
      {
        name: "print()",
        summary: "Display output in the terminal or browser",
        example: 'print("Hello")',
      },
      {
        name: ".py file",
        summary: "Save code in a file and run with python file.py",
        example: "python hello.py",
      },
      {
        name: "REPL",
        summary: "Interactive >>> prompt to try one line at a time",
        example: ">>> 2 + 2",
      },
    ],
  },
  {
    id: "print-and-errors",
    chapter: 2,
    title: "Print, Comments, and Errors",
    context: 'name = "Ada"',
    entries: [
      {
        name: "print()",
        summary: "Show one or more values on the screen",
        example: 'print("Hi", name)',
      },
      {
        name: "# comment",
        summary: "Notes for humans; Python ignores this line",
        example: "# TODO: fix later",
      },
      {
        name: "SyntaxError",
        summary: "Invalid Python grammar (fix spelling, colons, quotes)",
        example: 'print("oops',
      },
    ],
  },
  {
    id: "variables",
    chapter: 3,
    title: "Variables",
    context: "score = 10",
    entries: [
      { name: "name = value", summary: "Bind a name to a value", example: "score = 10" },
      {
        name: "name = name + 1",
        summary: "Update a variable with a new value",
        example: "score = score + 1",
      },
      {
        name: "a, b = 1, 2",
        summary: "Assign multiple names at once",
        example: "x, y = 1, 2",
      },
      {
        name: "snake_case",
        summary: "Use lowercase words separated by underscores",
        example: "user_age = 25",
      },
    ],
  },
  {
    id: "input",
    chapter: 4,
    title: "Input and Type Conversion",
    context: 'text = input("Age: ")',
    entries: [
      {
        name: "input()",
        summary: "Read one line of text from the user (always str)",
        example: 'input("Name: ")',
      },
      {
        name: "int()",
        summary: "Convert a string to a whole number",
        example: 'int("42")',
      },
      {
        name: "float()",
        summary: "Convert a string to a decimal number",
        example: 'float("3.5")',
      },
      { name: "str()", summary: "Convert a value to text", example: "str(99)" },
    ],
  },
  {
    id: "data-types",
    chapter: 5,
    title: "Data Types",
    context: "value = 42",
    entries: [
      {
        name: "int · float · str · bool",
        summary: "Common built-in types for numbers, text, and logic",
        example: "type(42)",
      },
      { name: "type()", summary: "Return the type of a value", example: "type(value)" },
      {
        name: "isinstance()",
        summary: "Test whether a value is a given type",
        example: "isinstance(value, int)",
      },
      {
        name: "None",
        summary: "Means no value; test with is None",
        example: "result = None",
      },
    ],
  },
  {
    id: "numbers",
    chapter: 6,
    title: "Numbers and Operators",
    context: "a, b = 10, 3",
    entries: [
      {
        name: "+  -  *  /",
        summary: "Add, subtract, multiply, divide (float division)",
        example: "a + b",
      },
      { name: "//", summary: "Floor division (drops the fraction)", example: "a // b" },
      { name: "%", summary: "Remainder after division", example: "a % b" },
      { name: "**", summary: "Exponent (power)", example: "2 ** 8" },
      { name: "+=  -=  *=", summary: "Update a variable in place", example: "a += 1" },
    ],
  },
  {
    id: "strings",
    chapter: 7,
    title: "Strings",
    context: 's = "hello world"',
    entries: [
      { name: "len()", summary: "Number of characters", example: "len(s)" },
      {
        name: "[i] · [start:stop]",
        summary: "Index one character or slice a range",
        example: "s[0] · s[0:5]",
      },
      {
        name: ".upper() · .lower()",
        summary: "Change letter case",
        example: "s.upper()",
      },
      {
        name: ".strip()",
        summary: "Remove leading and trailing whitespace",
        example: "s.strip()",
      },
      { name: ".split()", summary: "Split into a list of strings", example: "s.split()" },
      { name: '.split(",")', summary: "Split on a delimiter", example: 's.split(" ")' },
      {
        name: ".join()",
        summary: "Join a list of strings with a separator",
        example: '"-".join(parts)',
      },
      {
        name: ".replace()",
        summary: "Return a new string with replacements",
        example: 's.replace("l", "L")',
      },
      {
        name: ".find()",
        summary: "Index of substring, or -1 if missing",
        example: 's.find("world")',
      },
      {
        name: ".count()",
        summary: "How many times a substring appears",
        example: 's.count("l")',
      },
      {
        name: ".startswith() · .endswith()",
        summary: "Test beginning or end of string",
        example: 's.startswith("he")',
      },
      {
        name: "in",
        summary: "True if substring appears anywhere",
        example: '"ell" in s',
      },
      {
        name: 'f"..."',
        summary: "Formatted string with variables inside braces",
        example: 'f"Hi {name}"',
      },
    ],
  },
  {
    id: "booleans",
    chapter: 8,
    title: "Booleans and Conditions",
    context: "age = 20",
    entries: [
      {
        name: "True · False",
        summary: "Boolean literals (capital T and F)",
        example: "is_adult = age >= 18",
      },
      {
        name: "==  !=  <  >  <=  >=",
        summary: "Compare two values; result is bool",
        example: "age >= 18",
      },
      {
        name: "and · or · not",
        summary: "Combine or invert conditions",
        example: "age >= 18 and has_ticket",
      },
      {
        name: "if cond:",
        summary: "Run a block only when cond is truthy",
        example: "if age >= 18:\n    ...",
      },
      {
        name: "elif cond:",
        summary: "Else-if branch when earlier tests failed",
        example: "elif age >= 13:\n    ...",
      },
      {
        name: "else:",
        summary: "Run when no if/elif matched",
        example: "else:\n    ...",
      },
      {
        name: "in",
        summary: "Membership test (works on strings and collections)",
        example: '"a" in "abc"',
      },
      {
        name: "is",
        summary: "Same object identity (use for None)",
        example: "value is None",
      },
    ],
  },
  {
    id: "loops",
    chapter: 9,
    title: "Loops",
    context: "nums = [1, 2, 3]",
    entries: [
      {
        name: "while cond:",
        summary: "Repeat while cond stays true",
        example: "while n > 0:\n    n -= 1",
      },
      {
        name: "for ... in:",
        summary: "Run once per item in a sequence",
        example: "for n in nums:\n    print(n)",
      },
      {
        name: "range()",
        summary: "Numbers 0 .. n-1",
        example: "for i in range(3):\n    ...",
      },
      {
        name: "range(, )",
        summary: "Numbers from start up to stop-1",
        example: "range(1, 4)",
      },
      {
        name: "break",
        summary: "Leave the innermost loop immediately",
        example: "break",
      },
      {
        name: "continue",
        summary: "Skip to the next loop iteration",
        example: "continue",
      },
    ],
  },
  {
    id: "lists",
    chapter: 10,
    title: "Lists",
    context: "nums = [1, 2, 3]",
    entries: [
      { name: "[ ]", summary: "Create a list literal", example: "nums = [1, 2, 3]" },
      { name: "len()", summary: "Number of items", example: "len(nums)" },
      {
        name: "[i] · [a:b]",
        summary: "Get one item or a slice (new list)",
        example: "nums[0] · nums[1:3]",
      },
      {
        name: ".append()",
        summary: "Add one item at the end; returns None",
        example: "nums.append(4)",
      },
      {
        name: ".extend()",
        summary: "Add each element from another iterable",
        example: "nums.extend([4, 5])",
      },
      {
        name: ".insert()",
        summary: "Insert an item at an index",
        example: "nums.insert(0, 0)",
      },
      {
        name: ".remove()",
        summary: "Remove first matching value",
        example: "nums.remove(2)",
      },
      {
        name: ".pop()",
        summary: "Remove and return an item (last, or at index)",
        example: "nums.pop(0)",
      },
      { name: "del [i]", summary: "Delete item at index", example: "del nums[0]" },
      { name: ".clear()", summary: "Remove all items", example: "nums.clear()" },
      { name: ".sort()", summary: "Sort list in place", example: "nums.sort()" },
      { name: "sorted()", summary: "Return a new sorted list", example: "sorted(nums)" },
      { name: ".reverse()", summary: "Reverse list in place", example: "nums.reverse()" },
      {
        name: ".copy()",
        summary: "Shallow copy of the list",
        example: "other = nums.copy()",
      },
      {
        name: ".index()",
        summary: "Index of first matching value",
        example: "nums.index(2)",
      },
      {
        name: ".count()",
        summary: "How many times a value appears",
        example: "nums.count(2)",
      },
      {
        name: "enumerate()",
        summary: "Pairs of index and value in a loop",
        example: "for i, v in enumerate(nums):",
      },
      {
        name: "zip()",
        summary: "Pair items from two sequences",
        example: "list(zip(nums, other))",
      },
    ],
  },
  {
    id: "tuples",
    chapter: 11,
    title: "Tuples",
    context: "point = (10, 20)",
    entries: [
      {
        name: "( )",
        summary: "Ordered, immutable sequence",
        example: "point = (10, 20)",
      },
      {
        name: "( ,)",
        summary: "One-item tuple needs a trailing comma",
        example: "one = (42,)",
      },
      { name: "a, b =", summary: "Unpack values into names", example: "x, y = point" },
      { name: "[i]", summary: "Read one item (cannot assign)", example: "point[0]" },
      { name: "len()", summary: "Number of items", example: "len(point)" },
    ],
  },
  {
    id: "sets",
    chapter: 12,
    title: "Sets",
    context: 'tags = {"a", "b"}',
    entries: [
      {
        name: "{ } · set()",
        summary: "Unordered collection of unique items",
        example: 'tags = {"a", "b"}',
      },
      { name: ".add()", summary: "Add an item", example: 'tags.add("c")' },
      {
        name: ".remove()",
        summary: "Remove item (error if missing)",
        example: 'tags.remove("a")',
      },
      {
        name: ".discard()",
        summary: "Remove item if present (no error)",
        example: 'tags.discard("z")',
      },
      { name: "|", summary: "Union — items in either set", example: "a | b" },
      { name: "&", summary: "Intersection — items in both", example: "a & b" },
      { name: "-", summary: "Difference — in a but not b", example: "a - b" },
      { name: "in", summary: "Membership test", example: '"a" in tags' },
    ],
  },
  {
    id: "dictionaries",
    chapter: 13,
    title: "Dictionaries",
    context: 'user = {"name": "Ada", "age": 30}',
    entries: [
      {
        name: "{key: value}",
        summary: "Map keys to values",
        example: 'user = {"name": "Ada"}',
      },
      {
        name: '["key"]',
        summary: "Get value; KeyError if missing",
        example: 'user["name"]',
      },
      {
        name: ".get()",
        summary: "Get value or default if missing",
        example: 'user.get("role", "guest")',
      },
      { name: ".keys()", summary: "View of all keys", example: "list(user.keys())" },
      {
        name: ".values()",
        summary: "View of all values",
        example: "list(user.values())",
      },
      {
        name: ".items()",
        summary: "View of (key, value) pairs",
        example: "for k, v in user.items():",
      },
      { name: "[key] =", summary: "Add or update a key", example: 'user["age"] = 31' },
      {
        name: ".update()",
        summary: "Merge in keys from another dict",
        example: "user.update(extra)",
      },
      {
        name: ".pop()",
        summary: "Remove key and return its value",
        example: 'user.pop("age")',
      },
      {
        name: ".setdefault()",
        summary: "Set key only if it is missing",
        example: 'user.setdefault("role", "user")',
      },
      { name: "in", summary: "Test whether key exists", example: '"name" in user' },
    ],
  },
  {
    id: "functions",
    chapter: 14,
    title: "Functions",
    context: "def greet(x):",
    entries: [
      {
        name: "def()",
        summary: "Define a function with no parameters",
        example: "def greet():",
      },
      {
        name: "def(x)",
        summary: "Define a function with parameters",
        example: "def greet(x):",
      },
      {
        name: "def(x=)",
        summary: "Default value when the argument is omitted",
        example: "def add_one(x=0):",
      },
      {
        name: "return",
        summary: "Send a result back to the caller",
        example: "return x",
      },
      {
        name: '"""docstring"""',
        summary: "Describe the function on the line under def",
        example: '"""What this does."""',
      },
    ],
  },
  {
    id: "scope",
    chapter: 15,
    title: "Scope",
    context: "count = 0",
    entries: [
      {
        name: "local variable",
        summary: "Name assigned inside a function",
        example: "def f():\n    x = 1",
      },
      {
        name: "global name",
        summary: "Module-level name visible outside functions",
        example: "count = 0",
      },
      {
        name: "global",
        summary: "Assign to a module-level name inside a function",
        example: "global count",
      },
      {
        name: "nonlocal",
        summary: "Assign in enclosing (not global) scope",
        example: "nonlocal total",
      },
    ],
  },
  {
    id: "errors",
    chapter: 16,
    title: "Error Handling",
    context: "try:\n    ...",
    entries: [
      {
        name: "try:",
        summary: "Start a block that might fail",
        example: "try:\n    n = int(text)",
      },
      {
        name: "except:",
        summary: "Handle a specific error type",
        example: "except ValueError:\n    ...",
      },
      {
        name: "except as:",
        summary: "Catch error and bind message to a name",
        example: "except Exception as e:",
      },
      {
        name: "else:",
        summary: "Run if try succeeded (no exception)",
        example: "else:\n    print(ok)",
      },
      {
        name: "finally:",
        summary: "Always run (cleanup)",
        example: "finally:\n    close()",
      },
      {
        name: "raise",
        summary: "Raise your own exception",
        example: 'raise ValueError("bad")',
      },
    ],
  },
  {
    id: "files",
    chapter: 17,
    title: "Files",
    context: 'path = "notes.txt"',
    entries: [
      {
        name: 'open("r")',
        summary: "Open a file for reading text",
        example: 'open("data.txt", "r")',
      },
      {
        name: 'open("w")',
        summary: "Open for writing (overwrites)",
        example: 'open("out.txt", "w")',
      },
      {
        name: 'open("a")',
        summary: "Open for appending at end",
        example: 'open("log.txt", "a")',
      },
      {
        name: ".read()",
        summary: "Read entire file as one string",
        example: "text = f.read()",
      },
      {
        name: ".readlines()",
        summary: "Read lines into a list of strings",
        example: "lines = f.readlines()",
      },
      {
        name: ".write()",
        summary: "Write a string to the file",
        example: 'f.write("line\\n")',
      },
      {
        name: "with open():",
        summary: "Auto-close file when block ends",
        example: "with open(path) as f:",
      },
      {
        name: "Path()",
        summary: "pathlib path object (join, exists, read)",
        example: 'Path("data") / "file.txt"',
      },
    ],
  },
  {
    id: "modules",
    chapter: 18,
    title: "Modules",
    context: "import math",
    entries: [
      { name: "import", summary: "Load a module under its name", example: "import math" },
      {
        name: "from import",
        summary: "Import one name from a module",
        example: "from math import sqrt",
      },
      {
        name: "import as",
        summary: "Import with a shorter local name",
        example: "import datetime as dt",
      },
      {
        name: '__name__ == "__main__"',
        summary: "True when file is run directly",
        example: 'if __name__ == "__main__":',
      },
      {
        name: "sys.argv",
        summary: "Command-line arguments as strings",
        example: "import sys",
      },
    ],
  },
  {
    id: "packages",
    chapter: 19,
    title: "Packages and Imports",
    context: "python -m venv .venv",
    entries: [
      {
        name: "python -m venv",
        summary: "Create a virtual environment",
        example: "python -m venv .venv",
      },
      {
        name: "pip install",
        summary: "Install a package into active env",
        example: "pip install requests",
      },
      {
        name: "requirements.txt",
        summary: "List pinned dependencies for a project",
        example: "pip install -r requirements.txt",
      },
    ],
  },
  {
    id: "builtins",
    chapter: 20,
    title: "Useful Built-in Functions",
    context: "nums = [3, 1, 4]",
    entries: [
      {
        name: "len()",
        summary: "Length of a sequence or collection",
        example: "len(nums)",
      },
      { name: "sum()", summary: "Add numeric items", example: "sum(nums)" },
      {
        name: "min() · max()",
        summary: "Smallest or largest item",
        example: "min(nums)",
      },
      {
        name: "sorted()",
        summary: "New sorted list from iterable",
        example: "sorted(nums)",
      },
      {
        name: "enumerate()",
        summary: "Index and value pairs",
        example: "list(enumerate(nums))",
      },
      { name: "zip()", summary: "Pair items from iterables", example: "list(zip(a, b))" },
      {
        name: "any() · all()",
        summary: "True if any / all items are truthy",
        example: "any(nums)",
      },
      { name: "isinstance()", summary: "Type check", example: "isinstance(nums, list)" },
    ],
  },
  {
    id: "comprehensions",
    chapter: 21,
    title: "Comprehensions",
    context: "nums = [1, 2, 3, 4]",
    entries: [
      {
        name: "[... for ... in ...]",
        summary: "Build a new list in one expression",
        example: "[n * 2 for n in nums]",
      },
      {
        name: "[... for ... if ...]",
        summary: "List comp with a filter",
        example: "[n for n in nums if n % 2 == 0]",
      },
      {
        name: "{k: v for ...}",
        summary: "Build a new dictionary",
        example: "{k: len(k) for k in keys}",
      },
      {
        name: "{... for ...}",
        summary: "Build a set of unique values",
        example: "{n % 2 for n in nums}",
      },
    ],
  },
  {
    id: "classes",
    chapter: 22,
    title: "Object-Oriented Python",
    context: "class Dog:\n    ...",
    entries: [
      { name: "class:", summary: "Define a new type", example: "class Dog:" },
      {
        name: "def __init__():",
        summary: "Constructor; set up instance",
        example: "def __init__(self, name):",
      },
      { name: "self.", summary: "Instance attribute", example: "self.name = name" },
      {
        name: "def method():",
        summary: "Behavior on an instance",
        example: "def bark(self):",
      },
      { name: "Class()", summary: "Create an instance", example: 'buddy = Dog("Max")' },
      {
        name: "class (Parent):",
        summary: "Inherit from another class",
        example: "class Puppy(Dog):",
      },
      {
        name: "super()",
        summary: "Call parent implementation",
        example: "super().__init__(name)",
      },
      {
        name: "__str__ · __repr__",
        summary: "String forms for print and debugging",
        example: "def __str__(self):",
      },
    ],
  },
  {
    id: "advanced-functions",
    chapter: 23,
    title: "Advanced Functions",
    context: "def f(*args, **kwargs):",
    entries: [
      {
        name: "*args",
        summary: "Collect extra positional arguments as tuple",
        example: "def f(*args):",
      },
      {
        name: "**kwargs",
        summary: "Collect extra keyword arguments as dict",
        example: "def f(**kwargs):",
      },
      {
        name: "lambda:",
        summary: "Small anonymous function",
        example: "lambda x: x * 2",
      },
      {
        name: "@lru_cache",
        summary: "Cache return values by arguments",
        example: "@lru_cache",
      },
    ],
  },
  {
    id: "iterators",
    chapter: 24,
    title: "Iterators and Generators",
    context: "nums = [1, 2, 3]",
    entries: [
      {
        name: "iter()",
        summary: "Get an iterator from an iterable",
        example: "it = iter(nums)",
      },
      { name: "next()", summary: "Next value from iterator", example: "next(it)" },
      { name: "yield", summary: "Generator function; lazy sequence", example: "yield n" },
      {
        name: "StopIteration",
        summary: "Iterator has no more items",
        example: "next(it)  # raises",
      },
    ],
  },
  {
    id: "decorators",
    chapter: 25,
    title: "Decorators",
    context: "@timer\ndef work():",
    entries: [
      {
        name: "@decorator",
        summary: "Wrap a function to add behavior",
        example: "@decorator\ndef f():",
      },
      {
        name: "def decorator():",
        summary: "Outer function receives original",
        example: "def wrap(*a, **k):",
      },
      {
        name: "@property",
        summary: "Method accessed like an attribute",
        example: "@property\ndef age(self):",
      },
    ],
  },
  {
    id: "type-hints",
    chapter: 26,
    title: "Type Hints",
    context: "def greet(name: str) -> str:",
    entries: [
      { name: ": str", summary: "Annotate a parameter type", example: "def f(x: int):" },
      { name: "-> str", summary: "Annotate return type", example: "def f() -> str:" },
      {
        name: "list[int]",
        summary: "Generic collection types (3.9+)",
        example: "nums: list[int]",
      },
      {
        name: "Optional[]",
        summary: "Value or None",
        example: "from typing import Optional",
      },
      { name: "mypy", summary: "Optional static type checker", example: "mypy app.py" },
    ],
  },
  {
    id: "stdlib",
    chapter: 27,
    title: "Python Standard Library",
    context: "import json",
    entries: [
      {
        name: "json.loads()",
        summary: "Parse JSON string to Python",
        example: "json.loads('{\"a\":1}')",
      },
      {
        name: "json.dumps()",
        summary: "Python to JSON string",
        example: "json.dumps(data)",
      },
      {
        name: "datetime.now()",
        summary: "Current date and time",
        example: "from datetime import datetime",
      },
      {
        name: "logging.info()",
        summary: "Write a log message",
        example: 'logging.info("ok")',
      },
      {
        name: "re.search()",
        summary: "Find regex match in string",
        example: 're.search(r"\\d+", s)',
      },
      {
        name: "copy.deepcopy()",
        summary: "Full copy of nested structures",
        example: "copy.deepcopy(nested)",
      },
    ],
  },
  {
    id: "debugging",
    chapter: 28,
    title: "Debugging Python Code",
    context: "import pdb",
    entries: [
      {
        name: "help()",
        summary: "Interactive documentation in the shell",
        example: "help(list.append)",
      },
      { name: "dir()", summary: "List attribute names on an object", example: "dir([])" },
      {
        name: "breakpoint()",
        summary: "Pause and inspect at this line",
        example: "breakpoint()",
      },
      {
        name: "traceback",
        summary: "Error report: read last line first",
        example: "# see terminal output",
      },
    ],
  },
  {
    id: "testing",
    chapter: 29,
    title: "Testing Python Code",
    context: "def add(a, b): return a + b",
    entries: [
      {
        name: "assert",
        summary: "Crash if condition is false",
        example: "assert add(1, 2) == 3",
      },
      { name: "pytest", summary: "Run tests in test_*.py files", example: "pytest" },
      {
        name: "def test_():",
        summary: "pytest discovers functions starting with test_",
        example: "def test_add():",
      },
    ],
  },
  {
    id: "clean-code",
    chapter: 30,
    title: "Writing Clean Python",
    context: "ruff check .",
    entries: [
      {
        name: "ruff check",
        summary: "Lint for style and common bugs",
        example: "ruff check .",
      },
      { name: "black", summary: "Auto-format code to one style", example: "black src/" },
      {
        name: "PEP 8",
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
  "==  !=  <  >  <=  >=": "comparisons",
  "and · or · not": "and-or-not",
  "+  -  *  /": "operators",
  "+=  -=  *=": "augmented-assign",
  "int · float · str · bool": "builtin-types",
  "def(x=)": "def-default",
  "def(x)": "def-param",
};

function slugifyEntryName(name: string): string {
  const trimmed = name.trim();
  if (ENTRY_SLUG_ALIASES[trimmed]) return ENTRY_SLUG_ALIASES[trimmed];

  let s = trimmed.toLowerCase();
  s = s.replace(/[·]/g, "-");
  s = s.replace(/\([^)]*\)/g, "");
  s = s.replace(/[()]/g, "");
  s = s.replace(/\./g, "");
  s = s.replace(/[^\w-]+/g, "-");
  s = s.replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  if (!s) return "syntax";
  return s;
}

function buildEntrySlugs(sheet: ReferenceSheet): string[] {
  const counts = new Map<string, number>();
  return sheet.entries.map((entry) => {
    const base = slugifyEntryName(entry.name);
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

export function referenceChapterUrl(sheetId: string): string {
  return `/python/reference/${sheetId}/`;
}

export function referenceEntryUrl(sheetId: string, entrySlug: string): string {
  return `/python/reference/${sheetId}/${entrySlug}/`;
}

export function referenceEntryId(sheetId: string, index: number): string {
  return `${sheetId}-${index}`;
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

export function getReferenceSheetByChapter(chapter: number): ReferenceSheet | undefined {
  return REFERENCE_SHEETS.find((s) => s.chapter === chapter);
}
