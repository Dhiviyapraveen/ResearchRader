import { scrapeAllTopics } from "./ieee.scraper.js";
import { scrapeGoogleInternships } from "./google.scraper.js";

export const runAllScrapers = async () => {
  // Scrape conferences from AllConferenceAlert / IEEE
  const conferences = await scrapeAllTopics();  

  // Scrape Google research-only opportunities
  const opportunities = await scrapeGoogleInternships();  

  return { conferences, opportunities };
};

// ES Module test run
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    const result = await runAllScrapers();

    console.log("✅ Conferences:");

    console.log("✅ Research Opportunities:");
  })();
} 