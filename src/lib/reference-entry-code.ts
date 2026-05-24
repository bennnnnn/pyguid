import type {
  ReferenceEntry,
  ReferenceEntryPage,
  ReferenceSheet,
} from "./reference-sheets";

export type ReferenceEntryCode = {
  code: string;
  runnable: boolean;
  filename: string;
};

const SETUPS: Record<string, string[]> = {
  "print-and-errors": ['name = "Ada"'],
  variables: ["score = 10"],
  input: [],
  "data-types": ["value = 42"],
  numbers: ["a, b = 10, 3"],
  strings: ['s = "hello world"', 'parts = ["a", "b", "c"]', 'name = "Ada"'],
  booleans: ["age = 20", "has_ticket = True", "value = None"],
  loops: ["nums = [1, 2, 3]", "n = 3"],
  lists: ["nums = [1, 2, 3]", "other = [4, 5, 6]"],
  tuples: ["point = (10, 20)", "one = (42,)"],
  sets: ['tags = {"a", "b", "c"}', "a = {1, 2, 3}", "b = {2, 3, 4}"],
  dictionaries: [
    'user = {"name": "Ada", "age": 30}',
    'extra = {"role": "admin"}',
    'keys = ["a", "bb"]',
  ],
  functions: [],
  scope: ["count = 0"],
  errors: ['text = "42"'],
  files: [],
  modules: [],
  packages: [],
  builtins: ["nums = [3, 1, 4, 2]", "a = [1, 2]", "b = [3, 4]"],
  comprehensions: ["nums = [1, 2, 3, 4]"],
  classes: [],
  "advanced-functions": [],
  iterators: ["nums = [1, 2, 3]"],
  decorators: [],
  "type-hints": [],
  stdlib: ['data = {"name": "Ada"}', "s = 'Order 42'", "nested = [[1, 2], [3]]"],
  debugging: [],
  testing: ["def add(a, b):\n    return a + b"],
  "clean-code": [],
};

/** Maps new syntax labels to legacy example keys where they differ */
const LEGACY_EXAMPLE_KEYS: Record<string, string> = {
  "python file.py": ".py file",
  ">>>": "REPL",
  "+ - * /": "+  -  *  /",
  "+=": "+=  -=  *=",
  "range(n)": "range()",
  "range(start, stop)": "range(, )",
  "for item in seq:": "for ... in:",
  "del[i]": "del [i]",
  "def name():": "def()",
  "def name(x):": "def(x)",
  "def name(x=0):": "def(x=)",
  "class Name:": "class:",
  "class Child(Parent):": "class (Parent):",
  "def method():": "def method():",
  "def decorator():": "def decorator()",
  "def test_():": "def test_():",
  "[x for x in seq]": "[... for ... in ...]",
  "[x for x in seq if ...]": "[... for ... if ...]",
  "{k: v for ...}": "{k: v for ...}",
  "{x for x in seq}": "{... for ...}",
  "from ... import": "from import",
  "import ... as": "import as",
  'dict["key"]': '["key"]',
  'dict["key"] =': "[key] =",
  "tup[i]": "[i]",
  "a, b = tup": "a, b =",
  "(x,)": "( ,)",
  "s[i] · s[start:stop]": "[i] · [start:stop]",
  "== != < > <= >=": "==  !=  <  >  <=  >=",
};

/** Full runnable examples keyed by sheet id and syntax label */
const EXAMPLES: Record<string, Record<string, string>> = {
  "print-and-errors": {
    "print()": 'name = "Ada"\nprint("Hi", name)',
    "# comment": '# TODO: fix later\nprint("Comments start with #")',
    SyntaxError:
      '# Missing closing quote causes SyntaxError:\n# print("oops\n\nprint("Use matching quotes")',
    ".py file":
      '# Save as hello.py, then run:\n# python hello.py\n\nprint("Hello from a file!")',
    REPL: "# In the interactive REPL:\n# >>> 2 + 2\n# 4\n\nprint(2 + 2)",
  },
  variables: {
    "name = value": "score = 10\nprint(score)",
    "name = name + 1": "score = 10\nscore = score + 1\nprint(score)",
    "a, b = 1, 2": "x, y = 1, 2\nprint(x, y)",
    snake_case: "user_age = 25\nprint(user_age)",
  },
  input: {
    "input()":
      '# name = input("Name: ")  # reads text from the user\nname = "Ada"\nprint(name)',
    "int()": 'n = int("42")\nprint(n, type(n))',
    "float()": 'x = float("3.5")\nprint(x)',
    "str()": "text = str(99)\nprint(text, type(text))",
  },
  "data-types": {
    "int · float · str · bool":
      'print(type(42))\nprint(type(3.14))\nprint(type("hi"))\nprint(type(True))',
    "type()": "value = 42\nprint(type(value))",
    "isinstance()": "value = 42\nprint(isinstance(value, int))",
    None: "result = None\nprint(result is None)",
  },
  numbers: {
    "+  -  *  /": "a, b = 10, 3\nprint(a + b, a - b, a * b, a / b)",
    "//": "a, b = 10, 3\nprint(a // b)",
    "%": "a, b = 10, 3\nprint(a % b)",
    "**": "print(2 ** 8)",
    "+=  -= *=": "a = 10\na += 1\nprint(a)",
  },
  strings: {
    "len()": 's = "hello world"\nprint(len(s))',
    "[i] · [start:stop]": 's = "hello world"\nprint(s[0])\nprint(s[0:5])',
    ".upper() · .lower()": 's = "Hello"\nprint(s.upper())\nprint(s.lower())',
    ".strip()": 's = "  hi  "\nprint(s.strip())',
    ".split()": 's = "a b c"\nprint(s.split())',
    '.split(",")': 's = "a,b,c"\nprint(s.split(","))',
    ".join()": 'parts = ["a", "b", "c"]\nprint("-".join(parts))',
    ".replace()": 's = "hello"\nprint(s.replace("l", "L"))',
    ".find()": 's = "hello world"\nprint(s.find("world"))',
    ".count()": 's = "hello"\nprint(s.count("l"))',
    ".startswith() · .endswith()":
      's = "hello"\nprint(s.startswith("he"))\nprint(s.endswith("lo"))',
    in: 's = "hello"\nprint("ell" in s)',
    'f"..."': 'name = "Ada"\nprint(f"Hi {name}")',
  },
  booleans: {
    "True · False": "age = 20\nprint(age >= 18)",
    "==  !=  <  >  <=  >=": "age = 20\nprint(age >= 18, age != 0)",
    "and · or · not": "age = 20\nhas_ticket = True\nprint(age >= 18 and has_ticket)",
    "if cond:": 'age = 20\nif age >= 18:\n    print("adult")',
    "elif cond:":
      'age = 15\nif age >= 18:\n    print("adult")\nelif age >= 13:\n    print("teen")',
    "else:": 'age = 10\nif age >= 18:\n    print("adult")\nelse:\n    print("child")',
    in: 'print("a" in "abc")',
    is: "value = None\nprint(value is None)",
  },
  loops: {
    "while cond:": "n = 3\nwhile n > 0:\n    print(n)\n    n -= 1",
    "for ... in:": "nums = [1, 2, 3]\nfor n in nums:\n    print(n)",
    "range()": "for i in range(3):\n    print(i)",
    "range(, )": "print(list(range(1, 4)))",
    break: "for n in range(5):\n    if n == 3:\n        break\n    print(n)",
    continue: "for n in range(5):\n    if n == 2:\n        continue\n    print(n)",
  },
  lists: {
    "[ ]": "nums = [1, 2, 3]\nprint(nums)",
    "len()": "nums = [1, 2, 3]\nprint(len(nums))",
    "[i] · [a:b]": "nums = [1, 2, 3, 4, 5]\nprint(nums[0])\nprint(nums[1:3])",
    ".append()": "nums = [1, 2, 3]\nnums.append(4)\nprint(nums)",
    ".extend()": "nums = [1, 2, 3]\nnums.extend([4, 5])\nprint(nums)",
    ".insert()": "nums = [1, 2, 3]\nnums.insert(0, 0)\nprint(nums)",
    ".remove()": "nums = [1, 2, 3]\nnums.remove(2)\nprint(nums)",
    ".pop()": "nums = [1, 2, 3]\nprint(nums.pop())\nprint(nums)",
    "del [i]": "nums = [1, 2, 3]\ndel nums[0]\nprint(nums)",
    ".clear()": "nums = [1, 2, 3]\nnums.clear()\nprint(nums)",
    ".sort()": "nums = [3, 1, 4]\nnums.sort()\nprint(nums)",
    "sorted()": "nums = [3, 1, 4]\nprint(sorted(nums))",
    ".reverse()": "nums = [1, 2, 3]\nnums.reverse()\nprint(nums)",
    ".copy()": "nums = [1, 2, 3]\nother = nums.copy()\nprint(other)",
    ".index()": "nums = [1, 2, 3]\nprint(nums.index(2))",
    ".count()": "nums = [1, 2, 1]\nprint(nums.count(1))",
    "enumerate()": "nums = [10, 20, 30]\nfor i, v in enumerate(nums):\n    print(i, v)",
    "zip()": "a = [1, 2]\nb = [3, 4]\nprint(list(zip(a, b)))",
  },
  tuples: {
    "( )": "point = (10, 20)\nprint(point)",
    "( ,)": "one = (42,)\nprint(one, type(one))",
    "a, b =": "point = (10, 20)\nx, y = point\nprint(x, y)",
    "[i]": "point = (10, 20)\nprint(point[0])",
    "len()": "point = (10, 20)\nprint(len(point))",
  },
  sets: {
    "{ } · set()": 'tags = {"a", "b", "c"}\nprint(tags)',
    ".add()": 'tags = {"a", "b"}\ntags.add("c")\nprint(tags)',
    ".remove()": 'tags = {"a", "b"}\ntags.remove("a")\nprint(tags)',
    ".discard()": 'tags = {"a", "b"}\ntags.discard("z")\nprint(tags)',
    "|": "a = {1, 2}\nb = {2, 3}\nprint(a | b)",
    "&": "a = {1, 2}\nb = {2, 3}\nprint(a & b)",
    "-": "a = {1, 2, 3}\nb = {2, 3, 4}\nprint(a - b)",
    in: 'tags = {"a", "b"}\nprint("a" in tags)',
  },
  dictionaries: {
    "{key: value}": 'user = {"name": "Ada"}\nprint(user)',
    '["key"]': 'user = {"name": "Ada"}\nprint(user["name"])',
    ".get()": 'user = {"name": "Ada"}\nprint(user.get("role", "guest"))',
    ".keys()": 'user = {"name": "Ada", "age": 30}\nprint(list(user.keys()))',
    ".values()": 'user = {"name": "Ada", "age": 30}\nprint(list(user.values()))',
    ".items()": 'user = {"name": "Ada"}\nfor k, v in user.items():\n    print(k, v)',
    "[key] =": 'user = {"name": "Ada"}\nuser["age"] = 30\nprint(user)',
    ".update()": 'user = {"name": "Ada"}\nuser.update({"age": 30})\nprint(user)',
    ".pop()": 'user = {"name": "Ada", "age": 30}\nprint(user.pop("age"))',
    ".setdefault()":
      'user = {"name": "Ada"}\nuser.setdefault("role", "user")\nprint(user)',
    in: 'user = {"name": "Ada"}\nprint("name" in user)',
  },
  functions: {
    "def()": 'def greet():\n    print("Hello!")\n\ngreet()',
    "def(x)": 'def greet(name):\n    print(f"Hi {name}")\n\ngreet("Ada")',
    "def(x=)":
      "def add_one(n=0):\n    return n + 1\n\nprint(add_one())\nprint(add_one(5))",
    return: "def double(x):\n    return x * 2\n\nprint(double(4))",
    '"""docstring"""':
      'def greet(name):\n    """Return a friendly greeting."""\n    return f"Hi {name}"\n\nprint(greet("Ada"))',
  },
  scope: {
    "local variable": "def f():\n    x = 1\n    print(x)\n\nf()",
    "global name": "count = 0\nprint(count)",
    global:
      "count = 0\n\ndef bump():\n    global count\n    count += 1\n\nbump()\nprint(count)",
    nonlocal:
      "def outer():\n    total = 0\n    def inner():\n        nonlocal total\n        total += 1\n    inner()\n    return total\n\nprint(outer())",
  },
  errors: {
    "try:":
      'text = "42"\ntry:\n    n = int(text)\n    print(n)\nexcept ValueError:\n    print("Not a number")',
    "except:":
      'text = "x"\ntry:\n    n = int(text)\nexcept ValueError:\n    print("Invalid number")',
    "except as:":
      "try:\n    1 / 0\nexcept ZeroDivisionError as e:\n    print(type(e).__name__)",
    "else:":
      'text = "5"\ntry:\n    n = int(text)\nexcept ValueError:\n    print("bad")\nelse:\n    print("ok", n)',
    "finally:": 'f = None\ntry:\n    print("try")\nfinally:\n    print("always runs")',
    raise: 'raise ValueError("bad input")',
  },
  files: {
    'open("r")':
      'import io\nf = io.StringIO("Hello\\nWorld")\ntext = f.read()\nprint(text)',
    'open("w")':
      '# Opens a file for writing (overwrites)\nprint(\'Use: open("out.txt", "w")\')',
    'open("a")': '# Opens a file for appending\nprint(\'Use: open("log.txt", "a")\')',
    ".read()": 'import io\nf = io.StringIO("line1\\nline2")\nprint(f.read())',
    ".readlines()": 'import io\nf = io.StringIO("a\\nb\\n")\nprint(f.readlines())',
    ".write()": 'import io\nf = io.StringIO()\nf.write("Hi\\n")\nprint(f.getvalue())',
    "with open():": 'import io\nwith io.StringIO("data") as f:\n    print(f.read())',
    "Path()": 'from pathlib import Path\np = Path("data") / "file.txt"\nprint(p)',
  },
  modules: {
    import: "import math\nprint(math.sqrt(16))",
    "from import": "from math import sqrt\nprint(sqrt(16))",
    "import as": "import datetime as dt\nprint(dt.date.today())",
    '__name__ == "__main__"':
      'def main():\n    print("Running as a script")\n\nif __name__ == "__main__":\n    main()',
    "sys.argv": "import sys\nprint(sys.argv[0] if sys.argv else 'script name')",
  },
  packages: {
    "python -m venv":
      '# Terminal:\n# python -m venv .venv\nprint("Creates a virtual environment folder")',
    "pip install":
      '# Terminal:\n# pip install requests\nprint("Installs a package into the active environment")',
    "requirements.txt":
      '# Terminal:\n# pip install -r requirements.txt\nprint("Installs pinned packages from a list")',
  },
  builtins: {
    "len()": "nums = [3, 1, 4]\nprint(len(nums))",
    "sum()": "nums = [3, 1, 4]\nprint(sum(nums))",
    "min() · max()": "nums = [3, 1, 4]\nprint(min(nums), max(nums))",
    "sorted()": "nums = [3, 1, 4]\nprint(sorted(nums))",
    "enumerate()": "nums = [10, 20]\nprint(list(enumerate(nums)))",
    "zip()": "a = [1, 2]\nb = [3, 4]\nprint(list(zip(a, b)))",
    "any() · all()": "nums = [0, 1, 2]\nprint(any(nums), all(nums))",
    "isinstance()": "nums = [1, 2]\nprint(isinstance(nums, list))",
  },
  comprehensions: {
    "[... for ... in ...]": "nums = [1, 2, 3, 4]\nprint([n * 2 for n in nums])",
    "[... for ... if ...]": "nums = [1, 2, 3, 4]\nprint([n for n in nums if n % 2 == 0])",
    "{k: v for ...}": 'keys = ["a", "bb"]\nprint({k: len(k) for k in keys})',
    "{... for ...}": "nums = [1, 2, 3, 4]\nprint({n % 2 for n in nums})",
  },
  classes: {
    "class:":
      'class Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def bark(self):\n        return f"{self.name} says woof!"\n\nbuddy = Dog("Max")\nprint(buddy.bark())',
    "def __init__():":
      'class Dog:\n    def __init__(self, name):\n        self.name = name\n\nprint(Dog("Max").name)',
    "self.":
      'class Dog:\n    def __init__(self, name):\n        self.name = name\n\nprint(Dog("Max").name)',
    "def method():":
      'class Dog:\n    def bark(self):\n        return "woof!"\n\nprint(Dog().bark())',
    "Class()":
      'class Dog:\n    def __init__(self, name):\n        self.name = name\n\nprint(Dog("Max").name)',
    "class (Parent):":
      'class Dog:\n    def speak(self):\n        return "woof"\n\nclass Puppy(Dog):\n    pass\n\nprint(Puppy().speak())',
    "super()":
      'class Dog:\n    def __init__(self, name):\n        self.name = name\n\nclass Puppy(Dog):\n    def __init__(self, name):\n        super().__init__(name)\n\nprint(Puppy("Max").name)',
    "__str__ · __repr__":
      'class Dog:\n    def __init__(self, name):\n        self.name = name\n    def __str__(self):\n        return self.name\n\nprint(Dog("Max"))',
  },
  "advanced-functions": {
    "*args": "def total(*args):\n    return sum(args)\n\nprint(total(1, 2, 3))",
    "**kwargs": "def show(**kwargs):\n    print(kwargs)\n\nshow(x=1, y=2)",
    "lambda:": "double = lambda x: x * 2\nprint(double(5))",
    "@lru_cache":
      "from functools import lru_cache\n\n@lru_cache\n\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)\n\nprint(fib(10))",
  },
  iterators: {
    "iter()": "nums = [1, 2, 3]\nit = iter(nums)\nprint(next(it))",
    "next()": "nums = [1, 2, 3]\nit = iter(nums)\nprint(next(it))\nprint(next(it))",
    yield:
      "def countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\n\nprint(list(countdown(3)))",
    StopIteration:
      'nums = [1]\nit = iter(nums)\nprint(next(it))\ntry:\n    print(next(it))\nexcept StopIteration:\n    print("done")',
  },
  decorators: {
    "@decorator":
      'def loud(fn):\n    def wrap():\n        print("before")\n        fn()\n        print("after")\n    return wrap\n\n@loud\ndef hello():\n    print("hello")\n\nhello()',
    "def decorator()":
      'def repeat(fn):\n    def wrap():\n        fn()\n        fn()\n    return wrap\n\n@repeat\ndef hi():\n    print("hi")\n\nhi()',
    "@property":
      "class Person:\n    def __init__(self, birth_year):\n        self.birth_year = birth_year\n    @property\n    def age(self):\n        return 2026 - self.birth_year\n\np = Person(2000)\nprint(p.age)",
  },
  "type-hints": {
    ": str":
      'def greet(name: str) -> str:\n    return f"Hi {name}"\n\nprint(greet("Ada"))',
    "-> str": 'def title() -> str:\n    return "Hello"\n\nprint(title())',
    "list[int]": "nums: list[int] = [1, 2, 3]\nprint(nums)",
    "Optional[]":
      'from typing import Optional\n\ndef find_user(user_id: int) -> Optional[str]:\n    return "Ada" if user_id == 1 else None\n\nprint(find_user(1))',
    mypy: '# Terminal: mypy app.py\nprint("Static type checking before you run code")',
  },
  stdlib: {
    "json.loads()": "import json\nobj = json.loads('{\"a\": 1}')\nprint(obj)",
    "json.dumps()": 'import json\ndata = {"a": 1}\nprint(json.dumps(data))',
    "datetime.now()": "from datetime import datetime\nprint(datetime.now().year)",
    "logging.info()":
      'import logging\nlogging.basicConfig(level=logging.INFO)\nlogging.info("ok")',
    "re.search()":
      'import re\nm = re.search(r"\\d+", "Order 42")\nprint(m.group() if m else None)',
    "copy.deepcopy()":
      "import copy\nnested = [[1, 2], [3]]\nclone = copy.deepcopy(nested)\nclone[0][0] = 99\nprint(nested[0][0], clone[0][0])",
  },
  debugging: {
    "help()": "print(help(len))",
    "dir()": 'print(dir([])[:5], "...")',
    "breakpoint()": "x = 1\n# breakpoint()  # pauses in a real debugger\nprint(x)",
    traceback:
      '# When code fails, read the traceback bottom-up:\n#   File "...", line N\n#   ErrorType: message\nprint("See the terminal error output")',
  },
  testing: {
    assert:
      'def add(a, b):\n    return a + b\n\nassert add(1, 2) == 3\nprint("assert passed")',
    pytest: '# Terminal:\n# pytest\nprint("Runs test_*.py files with pytest")',
    "def test_()":
      'def add(a, b):\n    return a + b\n\ndef test_add():\n    assert add(1, 2) == 3\n\ntest_add()\nprint("test passed")',
  },
  "clean-code": {
    "ruff check":
      '# Terminal:\n# ruff check .\nprint("Lints your project for bugs and style")',
    black: '# Terminal:\n# black src/\nprint("Auto-formats Python files")',
    "PEP 8": "# Style tips:\nuser_age = 25  # snake_case names\nprint(user_age)",
  },
};

const NON_RUNNABLE = new Set([
  "python file.py",
  ">>>",
  ".py file",
  "REPL",
  "SyntaxError",
  'open("w")',
  'open("a")',
  "python -m venv",
  "pip install",
  "requirements.txt",
  "mypy",
  "pytest",
  "ruff check",
  "black",
  "traceback",
]);

function fallbackCode(sheet: ReferenceSheet, entry: ReferenceEntry): string {
  const line = (entry.example ?? entry.syntax).split(" · ")[0].trim();
  const setup = SETUPS[sheet.id] ?? (sheet.context ? [sheet.context] : []);
  const body = line.includes("\n") ? line : line;
  const lines = [...setup.filter((s) => !body.includes(s.split("=")[0]?.trim() ?? ""))];

  if (body.endsWith(":") || body.startsWith("def ") || body.startsWith("class ")) {
    lines.push(body, "    pass");
  } else if (shouldPrint(body)) {
    lines.push(`print(${body})`);
  } else {
    lines.push(body);
  }

  return lines.filter(Boolean).join("\n");
}

function shouldPrint(line: string): boolean {
  if (
    /^(def |class |import |from |for |while |if |try:|except|elif |else:|finally:|with |@|return |yield |global |nonlocal |break$|continue$)/.test(
      line,
    )
  ) {
    return false;
  }
  if (/[^!<>=]=/.test(line) && !line.trim().startsWith("print(")) {
    return false;
  }
  return !line.includes("print(");
}

export function getReferenceEntryCode(page: ReferenceEntryPage): ReferenceEntryCode {
  const { sheet, entry } = page;
  const sheetExamples = EXAMPLES[sheet.id];
  const code =
    entry.code ??
    sheetExamples?.[entry.syntax] ??
    sheetExamples?.[LEGACY_EXAMPLE_KEYS[entry.syntax] ?? ""] ??
    fallbackCode(sheet, entry);

  const runnable = entry.runnable ?? !NON_RUNNABLE.has(entry.syntax);

  return {
    code: code.trim(),
    runnable,
    filename: entry.filename ?? "example.py",
  };
}
