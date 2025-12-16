import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema({
  title: String,
  organization: String,
  link: String,
  source: String,
  scrapedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Opportunity", opportunitySchema);
