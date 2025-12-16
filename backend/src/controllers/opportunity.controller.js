import Opportunity from "../models/Opportunity.js";

export const getOpportunities = async (req, res) => {
  const data = await Opportunity.find().sort({ scrapedAt: -1 });
  res.json(data);
};
