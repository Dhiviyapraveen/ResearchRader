import cron from "node-cron";
import Conference from "../models/Conference.js";
import Opportunity from "../models/Opportunity.js";
import { runAllScrapers } from "../services/scraper/index.js";
import { normalizeText } from "../utils/normalizeData.js";

cron.schedule("0 2 * * *", async () => {
  try {
    console.log("🔄 Scraping job started");

    const { conferences, opportunities } = await runAllScrapers();

    for (const c of conferences) {
      await Conference.updateOne(
        { title: normalizeText(c.title), source: c.source },
        { $set: { ...c, title: normalizeText(c.title) } },
        { upsert: true }
      );
    }

    for (const o of opportunities) {
      await Opportunity.updateOne(
        { title: normalizeText(o.title), source: o.source },
        { $set: { ...o, title: normalizeText(o.title) } },
        { upsert: true }
      );
    }

    console.log("✅ Scraping job completed");
  } catch (err) {
    console.error("❌ Scraping job failed", err);
  }
});
