import axios from "axios";
import * as cheerio from "cheerio";

// Map of topics and their URLs on allconferencealert.net
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

export const scrapeAllTopics = async () => {
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

        if (title) {
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

      console.log(`✅ Scraped ${topic.name}: ${allConferences.length} conferences so far`);
    } catch (err) {
      console.error(`❌ Error scraping ${topic.name}:`, err.message);
    }
  }

  console.log(`\n✅ Total conferences scraped: ${allConferences.length}`);
  return allConferences;
};

// Example run
scrapeAllTopics().then((data) => console.log(data));
