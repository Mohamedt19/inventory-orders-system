import express from "express";
import auth from "../middleware/auth.js";
import { getSummary } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/summary", auth, getSummary);

export default router;