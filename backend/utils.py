import logging


def get_logger() -> logging.Logger:
    logging.basicConfig(level=logging.INFO)  # todo: make config for logger
    logger = logging.getLogger(__name__)
    return logger


# todo: rename this function
def error_handler(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            print(f'Error originates from function "{func.__module__}.{func.__name__}()"')
            raise e
    return wrapper
