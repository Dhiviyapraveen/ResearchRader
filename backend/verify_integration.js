import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import connectDB from "./src/config/db.js";
import { runAllScrapers } from "./src/services/scraper/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.join(__dirname, ".env") });

const verifyIntegration = async () => {
  await connectDB();

  console.log("🔄 Starting Full Integration Verification...");

  try {
    // Replicate scrapeCron.js logic
    console.log("▶️ Calling runAllScrapers()...");
    const { conferences, opportunities } = await runAllScrapers();

    console.log("✅ runAllScrapers() returned:");
    console.log(
      `   - Conferences: ${
        conferences ? conferences.length : "UNDEFINED"
      } items`
    );
    console.log(
      `   - Opportunities: ${
        opportunities ? opportunities.length : "UNDEFINED"
      } items`
    );

    if (!conferences) {
      console.error(
        "❌ CRTICAL ERROR: 'conferences' is undefined. This would crash scrapeCron.js!"
      );
    } else {
      console.log(
        "✅ 'conferences' is valid array. scrapeCron.js should proceed safe."
      );
    }

    if (!opportunities) {
      console.error("❌ CRTICAL ERROR: 'opportunities' is undefined.");
    } else {
      console.log("✅ 'opportunities' is valid array.");
    }
  } catch (err) {
    console.error("❌ Integration verification failed:", err);
  } finally {
    await mongoose.connection.close();
    console.log("✅ DB Connection closed.");
  }
};

verifyIntegration();
