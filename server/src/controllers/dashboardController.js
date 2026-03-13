import { getDashboardSummary } from "../services/dashboardService.js";

export async function getSummary(req, res, next) {
  try {
    const summary = await getDashboardSummary();
    res.status(200).json(summary);
  } catch (err) {
    next(err);
  }
}