import mongoose from "mongoose";

const conferenceSchema = new mongoose.Schema({
  title: String,
  link: String,
  source: String,
  scrapedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Conference", conferenceSchema);
