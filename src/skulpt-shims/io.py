"""Minimal io module for PyGuide's Skulpt runner.

Exposes StringIO from Skulpt's bundled StringIO library so `import io` works.
"""

from StringIO import StringIO as _StringIO


class StringIO(_StringIO):
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
        return False


__all__ = ["StringIO"]
