"""Minimal csv module for PyGuide's Skulpt runner.

Enough for tutorial examples with io.StringIO buffers (no real files).
"""


def _read_text(csvfile):
    if hasattr(csvfile, "getvalue"):
        return csvfile.getvalue()
    return csvfile.read()


def _parse_row(line):
    if line == "":
        return []
    row = []
    i = 0
    n = len(line)
    while i < n:
        if line[i] == '"':
            i += 1
            parts = []
            while i < n:
                if line[i] == '"':
                    if i + 1 < n and line[i + 1] == '"':
                        parts.append('"')
                        i += 2
                    else:
                        i += 1
                        break
                else:
                    parts.append(line[i])
                    i += 1
            row.append("".join(parts))
            if i < n and line[i] == ",":
                i += 1
        else:
            start = i
            while i < n and line[i] != ",":
                i += 1
            row.append(line[start:i])
            if i < n and line[i] == ",":
                i += 1
    return row


def _format_row(row):
    cells = []
    for cell in row:
        s = str(cell)
        if "," in s or '"' in s or "\n" in s or "\r" in s:
            s = '"' + s.replace('"', '""') + '"'
        cells.append(s)
    return ",".join(cells)


class reader(object):
    def __init__(self, csvfile, dialect="excel", **fmtparams):
        self._lines = _read_text(csvfile).splitlines()
        self._pos = 0

    def __iter__(self):
        return self

    def __next__(self):
        return self.next()

    def next(self):
        if self._pos >= len(self._lines):
            raise StopIteration
        line = self._lines[self._pos]
        self._pos += 1
        return _parse_row(line)


class writer(object):
    def __init__(self, csvfile, dialect="excel", **fmtparams):
        self._file = csvfile

    def writerow(self, row):
        self._file.write(_format_row(row) + "\n")


class DictReader(object):
    def __init__(self, csvfile, fieldnames=None, restkey=None, restval=None, dialect="excel", **kw):
        self._reader = reader(csvfile, dialect, **kw)
        self.fieldnames = fieldnames
        self.restkey = restkey
        self.restval = restval

    def __iter__(self):
        r = self._reader
        if self.fieldnames is None:
            self.fieldnames = next(r)
        for row in r:
            yield dict(zip(self.fieldnames, row))
