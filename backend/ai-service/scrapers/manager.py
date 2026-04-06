import logging
from tender_portal import AfricaGatewayScraper
from scholarship_portal import ScholarshipPortalScraper

logging.basicConfig(level=logging.INFO, format='%(asctime)s - MANAGER - %(levelname)s - %(message)s')
logger = logging.getLogger("Manager")

def run_all_scrapers():
    scrapers = [
        AfricaGatewayScraper(),
        ScholarshipPortalScraper()
    ]
    
    all_data = []
    
    for scraper in scrapers:
        try:
            logger.info(f"Running {scraper.name}...")
            results = scraper.scrape()
            if results:
                scraper.save_to_json(results, f"{scraper.name.lower()}_latest.json")
                all_data.extend(results)
        except Exception as e:
            logger.error(f"Error running {scraper.name}: {e}")
            
    logger.info(f"Total items collected: {len(all_data)}")
    
    # In a production environment, this would save to PostgreSQL and ChromaDB
    # For now, we normalize and log the sample output
    for item in all_data[:5]:  # Display first 5 for verification
        logger.info(f"Normalized Item: {item['title']} | Source: {item['source']}")

if __name__ == "__main__":
    run_all_scrapers()
