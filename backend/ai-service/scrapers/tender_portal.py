from base_scraper import BaseScraper
from bs4 import BeautifulSoup

class AfricaGatewayScraper(BaseScraper):
    def __init__(self):
        super().__init__("AfricaGateway", "https://www.africagateway.info/tenders")

    def scrape(self):
        self.logger.info("Starting scrape of AfricaGateway...")
        html = self.fetch_page(self.base_url)
        if not html:
            return []

        soup = self.parse_html(html)
        tenders = []
        
        # Example parsing logic (Targeting typical tender list structures)
        # Note: Actual selectors would be refined based on live site structure
        tender_cards = soup.select('.tender-item') or soup.select('tr')
        
        for card in tender_cards:
            try:
                title = card.select_one('.title').text.strip() if card.select_one('.title') else "No Title"
                deadline = card.select_one('.deadline').text.strip() if card.select_one('.deadline') else "No Deadline"
                location = card.select_one('.location').text.strip() if card.select_one('.location') else "Africa"
                link = card.select_one('a')['href'] if card.select_one('a') else self.base_url
                
                tenders.append({
                    "title": title,
                    "deadline": deadline,
                    "location": location,
                    "link": link,
                    "source": self.name,
                    "type": "Tender"
                })
            except Exception as e:
                self.logger.error(f"Error parsing card: {e}")

        self.logger.info(f"Successfully scraped {len(tenders)} tenders.")
        return tenders

if __name__ == "__main__":
    scraper = AfricaGatewayScraper()
    results = scraper.scrape()
    print(results)
