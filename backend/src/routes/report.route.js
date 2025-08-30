import express from "express";
import { createReport, getReports } from "../controllers/report.controller.js";

const router = express.Router();

router.post("/", createReport);               // create report
router.get("/", getReports);                  // get all reports
// router.put("/:id/status", updateReportStatus); // update report status

export default router;
