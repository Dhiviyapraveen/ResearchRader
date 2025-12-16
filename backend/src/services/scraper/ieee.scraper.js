import axios from "axios";
import * as cheerio from "cheerio";

export const scrapeIEEE = async () => {
  const url = "https://www.ieee.org/conferences/index.html";
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const results = [];

  $("a").each((_, el) => {
    const title = $(el).text().trim();
    const link = $(el).attr("href");

    if (title && link && link.startsWith("http")) {
      results.push({
        title,
        link,
        source: "IEEE"
      });
    }
  });

  return results.slice(0, 10);
};
