import mongoose from "mongoose";

const conferenceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: String,
  venue: String,
  link: String,
  topic: String,
  source: String,
  scrapedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Conference", conferenceSchema);
