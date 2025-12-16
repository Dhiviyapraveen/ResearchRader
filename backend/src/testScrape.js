import { scrapeIEEE } from "./services/scraper/ieee.scraper.js";

(async () => {
  const data = await scrapeIEEE();
  console.log(data.slice(0, 5)); // show first 5
  process.exit(0);
})();
