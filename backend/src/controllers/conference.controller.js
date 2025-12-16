import Conference from "../models/Conference.js";

export const getConferences = async (req, res) => {
  const data = await Conference.find().sort({ scrapedAt: -1 });
  res.json(data);
};
