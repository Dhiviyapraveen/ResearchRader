import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 👇 Required for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 FORCE load .env from backend root
dotenv.config({ path: path.join(__dirname, "../.env") });

import app from "./app.js";
import connectDB from "./config/db.js";
import "./jobs/scrapeCron.js";
import "./jobs/reminderCron.js";

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

