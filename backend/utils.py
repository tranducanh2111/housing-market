# Filename: main.py
#
# Description: Utility functions.
#
# Author: John Iliadis - 104010553


import logging


def get_logger() -> logging.Logger:
    logging.basicConfig(level=logging.DEBUG)
    logger = logging.getLogger(__name__)
    return logger


def trace_exception(func):
    """A decorator used for tracing the original function that raised the exception."""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            print(f'Error raised in function "{func.__module__}.{func.__name__}()"')
            raise e
    return wrapper
