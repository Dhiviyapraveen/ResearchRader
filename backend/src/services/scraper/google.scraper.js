import puppeteer from "puppeteer";

const RESEARCH_KEYWORDS = [
  "research",
  "research intern",
  "research scientist",
  "research assistant",
  "phd",
  "msc",
];

import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import connectDB from "../../config/db.js";
import Opportunity from "../../models/Opportunity.js";
import { normalizeText } from "../../utils/normalizeData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const scrapeGoogleInternships = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  const page = await browser.newPage();

  try {
    await page.goto(
      "https://www.google.com/about/careers/applications/jobs/results/?company=Google&company=YouTube&q=research%20intern",
      { waitUntil: "networkidle2" }
    );

    // Wait for job cards (li.lLd3Je)
    try {
      await page.waitForSelector("li.lLd3Je", { timeout: 10000 });
    } catch (e) {
      console.log(
        "⚠️ No job cards found immediately. Checking for 'No results'..."
      );
    }

    // Scroll window to load more jobs (infinite scroll)
    await autoScroll(page);

    const jobs = await page.evaluate((keywords) => {
      const results = [];

      // Select all job cards
      const cards = document.querySelectorAll("li.lLd3Je");

      cards.forEach((card) => {
        // Title: h3.QJPWVe
        const titleEl = card.querySelector("h3.QJPWVe");
        const title = titleEl ? titleEl.innerText.trim() : null;

        // Link: a.WpHeLc (usually the 'Learn more' or title link)
        const linkEl = card.querySelector("a.WpHeLc");
        const link = linkEl ? linkEl.href : null;

        if (!title || !link) return;

        // Filter by keywords
        const isResearch = keywords.some((k) =>
          title.toLowerCase().includes(k)
        );

        if (!isResearch) return;

        results.push({
          title,
          organization: "Google",
          type: "Research Opportunity",
          link,
          source: "Google Careers",
          scrapedAt: new Date().toISOString(),
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
// Scroll window to bottom to trigger infinite scroll
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        // Stop if we've scrolled enough or reached the bottom (heuristic)
        // Google jobs list can be very long, so let's limit it to ~10000px or when it stops growing
        if (totalHeight >= scrollHeight || totalHeight > 10000) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

// Test run
// Test run - Saves to DB when run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    try {
      // Load env vars
      dotenv.config({ path: path.join(__dirname, "../../../.env") });

      await connectDB();
      console.log("🔌 Connected to DB for manual scrape");

      const jobs = await scrapeGoogleInternships();

      if (jobs.length > 0) {
        console.log(`💾 Saving ${jobs.length} opportunities...`);
        let saved = 0;
        for (const job of jobs) {
          const result = await Opportunity.updateOne(
            { title: normalizeText(job.title), source: job.source },
            { $set: { ...job, title: normalizeText(job.title) } },
            { upsert: true }
          );
          if (result.upsertedCount || result.modifiedCount) saved++;
        }
        console.log(`✅ Successfully saved/updated ${saved} opportunities.`);
      } else {
        console.log("⚠️ No jobs found to save.");
      }
    } catch (err) {
      console.error("❌ Manual scrape failed:", err);
    } finally {
      await import("mongoose").then((m) => m.default.connection.close());
      process.exit();
    }
  })();
}
