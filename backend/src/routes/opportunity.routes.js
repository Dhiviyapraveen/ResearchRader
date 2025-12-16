import express from "express";
import { getOpportunities } from "../controllers/opportunity.controller.js";

const router = express.Router();
router.get("/", getOpportunities);

export default router;
