import express from "express";
import authRoutes from "./routes/auth.routes.js";
import conferenceRoutes from "./routes/conference.routes.js";
import opportunityRoutes from "./routes/opportunity.routes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/conferences", conferenceRoutes);
app.use("/api/opportunities", opportunityRoutes);

app.get("/", (req, res) => {
  res.send("Research Aggregator Backend Running");
});

app.use(errorHandler);

export default app;
