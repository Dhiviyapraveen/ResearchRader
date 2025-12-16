import cron from "node-cron";
import Conference from "../models/Conference.js";
import logger from "../utils/logger.js";

cron.schedule("0 9 * * *", async () => {
  try {
    logger.info("⏰ Reminder job started");

    const today = new Date();
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);

    const upcoming = await Conference.find({
      deadline: { $gte: today, $lte: next7Days }
    });

    upcoming.forEach(conf => {
      logger.info(
        `📢 Reminder: ${conf.title} deadline on ${conf.deadline}`
      );
    });

    logger.info("✅ Reminder job completed");
  } catch (err) {
    logger.error("❌ Reminder job failed", err);
  }
});
