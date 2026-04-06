import requests
from bs4 import BeautifulSoup
import time
import random
import logging

class BaseScraper:
    def __init__(self, name, base_url):
        self.name = name
        self.base_url = base_url
        self.session = requests.Session()
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        logging.basicConfig(level=logging.INFO, format=f'%(asctime)s - {name} - %(levelname)s - %(message)s')
        self.logger = logging.getLogger(name)

    def fetch_page(self, url, params=None):
        """Fetch page with retries and random delay."""
        retries = 3
        for i in range(retries):
            try:
                time.sleep(random.uniform(1, 3))
                response = self.session.get(url, headers=self.headers, params=params, timeout=15)
                response.raise_for_status()
                return response.text
            except Exception as e:
                self.logger.warning(f"Attempt {i+1} failed for {url}: {e}")
                if i == retries - 1:
                    self.logger.error(f"Failed to fetch {url} after {retries} attempts.")
                    return None

    def parse_html(self, html):
        """Override this method in subclasses."""
        return BeautifulSoup(html, 'html.parser')

    def scrape(self):
        """Main entry point for the scraper."""
        raise NotImplementedError("Subclasses must implement the scrape method.")

    def save_to_json(self, data, filename):
        """Save scraped data to a JSON file in the data/scraped directory."""
        import json
        import os
        path = os.path.join("data", "scraped", filename)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        self.logger.info(f"Saved {len(data)} items to {path}")

    def save_to_db(self, data):
        """Placeholder for PostgreSQL/Chroma integration."""
        self.logger.info(f"Database sync triggered for {len(data)} items.")
        pass
