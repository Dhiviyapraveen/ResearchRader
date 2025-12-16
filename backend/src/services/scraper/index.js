import { scrapeIEEE } from "./ieee.scraper.js";
import { scrapeGoogleInternships } from "./google.scraper.js";

export const runAllScrapers = async () => {
  const conferences = await scrapeIEEE();
  const opportunities = await scrapeGoogleInternships();

  return { conferences, opportunities };
};
