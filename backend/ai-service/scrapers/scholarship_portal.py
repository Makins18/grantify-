from base_scraper import BaseScraper

class ScholarshipPortalScraper(BaseScraper):
    def __init__(self):
        super().__init__("OpportunitiesForAfricans", "https://www.opportunitiesforafricans.com/category/scholarships/")

    def scrape(self):
        self.logger.info("Starting scrape of Opportunities For Africans...")
        html = self.fetch_page(self.base_url)
        if not html:
            return []

        soup = self.parse_html(html)
        scholarships = []
        
        # Targeting WordPress category list structure
        articles = soup.find_all('article')
        
        for article in articles:
            try:
                title_tag = article.find('h2') or article.find('h3')
                title = title_tag.text.strip() if title_tag else "Scholarship Opportunity"
                link = title_tag.find('a')['href'] if title_tag and title_tag.find('a') else self.base_url
                summary = article.find('div', class_='entry-content').text.strip()[:200] if article.find('div', class_='entry-content') else ""
                
                scholarship = {
                    "title": title,
                    "link": link,
                    "summary": summary,
                    "source": self.name,
                    "type": "Scholarship",
                    "location": "Nigeria" if "nigeria" in title.lower() or "nigeria" in summary.lower() else "Varies"
                }

                # Filtering: Check for "Nigeria" or "Nigerian"
                text_to_check = (scholarship["title"] + " " + scholarship["summary"]).lower()
                if "nigeria" in text_to_check or "nigerian" in text_to_check:
                    scholarships.append(scholarship)
                else:
                    self.logger.debug(f"Skipping non-Nigerian opportunity: {title}")
            except Exception as e:
                self.logger.error(f"Error parsing article: {e}")

        self.logger.info(f"Successfully scraped {len(scholarships)} scholarships.")
        return scholarships

if __name__ == "__main__":
    scraper = ScholarshipPortalScraper()
    results = scraper.scrape()
    print(results)
