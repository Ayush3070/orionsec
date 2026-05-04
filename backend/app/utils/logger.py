from loguru import logger
import sys


def setup_logger():
    logger.remove()

    fmt = (
        "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan> - "
        "<level>{message}</level>"
    )
    logger.add(sys.stdout, format=fmt, level="INFO")

    file_fmt = (
        "{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | "
        "{name}:{function} - {message}"
    )
    logger.add(
        "logs/orionsec_{time:YYYY-MM-DD}.log",
        rotation="00:00",
        retention="30 days",
        format=file_fmt,
        level="DEBUG")

    return logger


log = setup_logger()
