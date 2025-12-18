import puppeteer from "puppeteer";

const RESEARCH_KEYWORDS = [
  "research",
  "research intern",
  "research scientist",
  "research assistant",
  "phd",
  "msc"
];

export const scrapeGoogleInternships = async () => {
  const browser = await puppeteer.launch({
    headless: false, // IMPORTANT
    defaultViewport: null,
    args: ["--start-maximized"]
  });

  const page = await browser.newPage();

  try {
    await page.goto(
      "https://www.google.com/about/careers/applications/jobs/results/?company=Google&company=YouTube&q=research",
      { waitUntil: "networkidle2" }
    );

    // Wait until job cards appear
    await page.waitForFunction(() => {
      return document.querySelectorAll("gc-job-card").length > 0;
    }, { timeout: 20000 });

    // Scroll job list container
    await autoScrollGoogleJobs(page);

    const jobs = await page.evaluate((keywords) => {
      const results = [];

      document.querySelectorAll("gc-job-card").forEach(card => {
        const title =
          card.querySelector("h2")?.innerText?.trim() ||
          card.querySelector(".gc-job-card__title")?.innerText?.trim();

        const link = card.querySelector("a")?.href;

        if (!title || !link) return;

        const isResearch = keywords.some(k =>
          title.toLowerCase().includes(k)
        );

        if (!isResearch) return;

        results.push({
          title,
          organization: "Google",
          type: "Research Opportunity",
          link,
          source: "Google Careers",
          scrapedAt: new Date().toISOString()
        });
      });

      return results;
    }, RESEARCH_KEYWORDS);

    console.log(`✅ Google Research jobs scraped: ${jobs.length}`);
    console.table(jobs);
    return jobs;

  } catch (err) {
    console.error("❌ Google scraping failed:", err);
    return [];
  } finally {
    await browser.close();
  }
};

// Scroll inside Google job container
async function autoScrollGoogleJobs(page) {
  await page.evaluate(async () => {
    const container = document.querySelector("gc-job-list");
    if (!container) return;

    await new Promise(resolve => {
      let lastHeight = 0;
      const timer = setInterval(() => {
        container.scrollBy(0, 500);
        const newHeight = container.scrollHeight;

        if (newHeight === lastHeight) {
          clearInterval(timer);
          resolve();
        }
        lastHeight = newHeight;
      }, 300);
    });
  });
}

// Test run
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeGoogleInternships();
}
