import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import axios from "axios";
import * as cheerio from "cheerio";
import Conference from "../../models/Conference.js";

// 🔹 Topics
const TOPICS = [
  { name: "Business and Economics", url: "https://allconferencealert.net/business-and-economics.php" },
  { name: "Education", url: "https://allconferencealert.net/education.php" },
  { name: "Health and Medicine", url: "https://allconferencealert.net/health-and-medicine.php" },
  { name: "Interdisciplinary", url: "https://allconferencealert.net/interdisciplinary.php" },
  { name: "Law", url: "https://allconferencealert.net/law.php" },
  { name: "Engineering Topics", url: "https://allconferencealert.net/engineering.php" },
  { name: "Engineering and Technology", url: "https://allconferencealert.net/engineering-and-technology.php" },
  { name: "Mathematics and Statistics", url: "https://allconferencealert.net/mathematics-and-statistics.php" },
  { name: "Social Sciences and Humanities", url: "https://allconferencealert.net/social-sciences-and-humanities.php" },
  { name: "Regional Studies", url: "https://allconferencealert.net/regional-studies.php" },
  { name: "Physical and Life Sciences", url: "https://allconferencealert.net/physical-and-life-sciences.php" },
  { name: "Sports Science", url: "https://allconferencealert.net/topics/sport-science.php" },
];
// 🔹 Scraper
const scrapeAllTopics = async () => {
  const allConferences = [];

  for (const topic of TOPICS) {
    try {
      const { data } = await axios.get(topic.url, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      const $ = cheerio.load(data);

      $("table tr").each((_, el) => {
        const date = $(el).find("td:first-child").text().trim();
        const titleEl = $(el).find("td:nth-child(2) a");
        const title = titleEl.text().trim();
        const link = titleEl.attr("href");
        const venue = $(el).find("td:nth-child(3)").text().trim();

        if (title && link) {
          allConferences.push({
            title,
            date,
            venue,
            link,
            topic: topic.name,
            source: "All Conference Alert",
            scrapedAt: new Date(),
          });
        }
      });

      console.log(`✅ Scraped ${topic.name}`);
    } catch (err) {
      console.error(`❌ Error scraping ${topic.name}:`, err.message);
    }
  }

  console.log(`📊 Total scraped: ${allConferences.length}`);

  if (allConferences.length > 0) {
    await Conference.insertMany(allConferences);
    console.log("💾 Data saved to MongoDB");
  }
};

// 🔹 MAIN EXECUTION (CORRECT ORDER)
const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await scrapeAllTopics();

  } catch (err) {
    console.error("❌ Fatal error:", err);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
};

run();
