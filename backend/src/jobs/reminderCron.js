import cron from "node-cron";
import Conference from "../models/Conference.js";

cron.schedule("0 9 * * *", async () => {
  try {
    console.log("⏰ Reminder job started");

    const today = new Date();
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);

    const upcoming = await Conference.find({
      deadline: { $gte: today, $lte: next7Days },
    });

    upcoming.forEach((conf) => {
      console.log(`📢 Reminder: ${conf.title} deadline on ${conf.deadline}`);
    });

    console.log("✅ Reminder job completed");
  } catch (err) {
    console.error("❌ Reminder job failed", err);
  }
});
