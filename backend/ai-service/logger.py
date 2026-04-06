"""
TenderSense AI — Structured Logger
Writes JSON-line logs to data/logs with rotation and event tracking.
"""
import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path

# Resolve to project root/data/logs
BASE_DIR = Path(__file__).parent
LOGS_DIR = (BASE_DIR / ".." / ".." / "data" / "logs").resolve()
LOGS_DIR.mkdir(parents=True, exist_ok=True)

SCRAPE_LOG = LOGS_DIR / "scrape_events.jsonl"
CACHE_LOG   = LOGS_DIR / "cache_events.jsonl"
VECTOR_LOG  = LOGS_DIR / "vector_events.jsonl"
ERROR_LOG   = LOGS_DIR / "errors.jsonl"
SYSTEM_LOG  = LOGS_DIR / "system.log"

MAX_LOG_BYTES = 5 * 1024 * 1024  # 5 MB per file before rotation


def _write(path: Path, record: dict):
    record["ts"] = datetime.now(timezone.utc).isoformat()
    # Rotate if file too large
    if path.exists() and path.stat().st_size > MAX_LOG_BYTES:
        rotated = path.with_suffix(f".{datetime.utcnow().strftime('%Y%m%d%H%M%S')}.jsonl")
        path.rename(rotated)
    with open(path, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")


def log_scrape_event(source: str, added: int, skipped: int, total: int, status: str = "ok", error: str = None):
    _write(SCRAPE_LOG, {
        "event": "scrape",
        "source": source,
        "added": added,
        "skipped": skipped,
        "total": total,
        "status": status,
        "error": error,
    })


def log_cache_event(key: str, hit: bool, ttl: int = None):
    _write(CACHE_LOG, {
        "event": "cache_hit" if hit else "cache_miss",
        "key": key,
        "ttl": ttl,
    })


def log_vector_event(action: str, added: int = 0, skipped: int = 0, total: int = 0):
    _write(VECTOR_LOG, {
        "event": f"vector_{action}",
        "added": added,
        "skipped": skipped,
        "total": total,
    })


def log_error(source: str, error: str, context: dict = None):
    _write(ERROR_LOG, {
        "event": "error",
        "source": source,
        "error": error,
        "context": context or {},
    })


def setup_system_logging(level=logging.INFO):
    """Configure root logger to also write to system.log."""
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler(str(SYSTEM_LOG), encoding="utf-8"),
        ]
    )


def get_recent_logs(log_type: str = "scrape", limit: int = 50) -> list:
    """Return the last N log entries for a given log type."""
    path_map = {
        "scrape": SCRAPE_LOG,
        "cache": CACHE_LOG,
        "vector": VECTOR_LOG,
        "error": ERROR_LOG,
    }
    path = path_map.get(log_type, SCRAPE_LOG)
    if not path.exists():
        return []
    lines = path.read_text(encoding="utf-8").strip().splitlines()
    recent = lines[-limit:]
    results = []
    for line in recent:
        try:
            results.append(json.loads(line))
        except Exception:
            pass
    return list(reversed(results))
