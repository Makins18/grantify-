"""
TenderSense AI — Auto-Update Scheduler
Runs scrapers and re-indexes vectors on a configurable schedule.
"""
import os
import json
import logging
from pathlib import Path
from datetime import datetime

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.events import EVENT_JOB_ERROR, EVENT_JOB_EXECUTED

logger = logging.getLogger("Scheduler")

# Import internal modules
try:
    from logger import log_scrape_event, log_vector_event, log_error
    from vector_store import get_store
except ImportError:
    # Fallback when running standalone
    def log_scrape_event(*a, **k): pass
    def log_vector_event(*a, **k): pass
    def log_error(*a, **k): pass
    def get_store(): return None


# ── Data paths ────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
SCRAPED_DIR = (BASE_DIR / ".." / ".." / "data" / "scraped").resolve()


def load_all_scraped() -> list:
    """Load every JSON file from data/scraped."""
    all_items = []
    if not SCRAPED_DIR.exists():
        return all_items
    for fname in SCRAPED_DIR.glob("*.json"):
        try:
            with open(fname, "r", encoding="utf-8") as f:
                data = json.load(f)
            if isinstance(data, list):
                all_items.extend(data)
        except Exception as e:
            logger.error(f"Failed to load {fname}: {e}")
    logger.info(f"Loaded {len(all_items)} raw items from {SCRAPED_DIR}")
    return all_items


def run_scraping_job():
    """Core job: reload scraped data and upsert into vector store."""
    logger.info("⚡ [Scheduler] Auto-update job started.")
    try:
        items = load_all_scraped()
        store = get_store()
        if store and items:
            result = store.upsert(items)
            log_vector_event("upsert", **result)
            log_scrape_event(
                source="auto-scheduler",
                added=result["added"],
                skipped=result["skipped"],
                total=result["total"],
                status="ok"
            )
            logger.info(f"✅ [Scheduler] Upserted: +{result['added']} new, {result['skipped']} duplicates. Total: {result['total']}")
        else:
            logger.warning("[Scheduler] No items found or store unavailable.")
    except Exception as e:
        logger.error(f"[Scheduler] Job failed: {e}")
        log_error("scheduler", str(e), {"job": "run_scraping_job"})


def run_scraping_with_live_scrapers():
    """
    Extends run_scraping_job with actual live web scraping.
    This triggers the opportunitiesforafricans scraper to fetch fresh data.
    """
    logger.info("🌐 [Scheduler] Running live scrapers...")
    try:
        import sys
        sys.path.insert(0, str(BASE_DIR / "scrapers"))
        from scholarship_portal import ScholarshipPortalScraper

        scraper = ScholarshipPortalScraper()
        results = scraper.scrape()
        if results:
            scraper.save_to_json(results, "opportunitiesforafricans_latest.json")
            logger.info(f"[Scraper] Scraped {len(results)} items from live source.")
            log_scrape_event(
                source="ScholarshipPortalScraper",
                added=len(results),
                skipped=0,
                total=len(results),
                status="ok"
            )
        else:
            logger.warning("[Scraper] Live scrape returned 0 results.")
    except Exception as e:
        logger.error(f"[Scraper] Live scrape failed: {e}")
        log_error("live_scraper", str(e))
    
    # Always run the index refresh after scraping
    run_scraping_job()


def on_job_event(event):
    if event.exception:
        logger.error(f"[Scheduler] Job {event.job_id} crashed: {event.exception}")
        log_error("scheduler_event", str(event.exception), {"job_id": event.job_id})
    else:
        logger.info(f"[Scheduler] Job {event.job_id} completed successfully.")


# ── Singleton scheduler ────────────────────────────────────────────────────────
_scheduler = None


def get_scheduler() -> BackgroundScheduler:
    return _scheduler


def start_scheduler():
    global _scheduler
    if _scheduler and _scheduler.running:
        logger.info("[Scheduler] Already running.")
        return _scheduler

    _scheduler = BackgroundScheduler(timezone="UTC")
    _scheduler.add_listener(on_job_event, EVENT_JOB_ERROR | EVENT_JOB_EXECUTED)

    # 1. Index refresh every 30 minutes (fast — just loads from disk)
    _scheduler.add_job(
        run_scraping_job,
        trigger="interval",
        minutes=30,
        id="index_refresh",
        name="Index Refresh (disk reload)",
        replace_existing=True,
    )

    # 2. Full live scrape every 12 hours
    _scheduler.add_job(
        run_scraping_with_live_scrapers,
        trigger="interval",
        hours=12,
        id="live_scrape",
        name="Live Web Scrape + Re-Index",
        replace_existing=True,
    )

    _scheduler.start()
    logger.info("🕒 [Scheduler] Started. Jobs: index_refresh (30min), live_scrape (12h).")

    # Seed the vector store immediately on start
    logger.info("[Scheduler] Running initial seed job...")
    run_scraping_job()

    return _scheduler


def stop_scheduler():
    global _scheduler
    if _scheduler and _scheduler.running:
        _scheduler.shutdown(wait=False)
        logger.info("[Scheduler] Stopped.")


def get_scheduler_status() -> dict:
    if not _scheduler:
        return {"running": False, "jobs": []}
    jobs = []
    for job in _scheduler.get_jobs():
        jobs.append({
            "id": job.id,
            "name": job.name,
            "next_run": job.next_run_time.isoformat() if job.next_run_time else None,
        })
    return {"running": _scheduler.running, "jobs": jobs}
