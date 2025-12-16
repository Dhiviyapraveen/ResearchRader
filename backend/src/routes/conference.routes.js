import express from "express";
import { getConferences } from "../controllers/conference.controller.js";

const router = express.Router();
router.get("/", getConferences);

export default router;
