import Report from "../models/Report.js";

// Create new report
export const createReport = async (req, res) => {
  try {
    const { title, description, location, photoUrl } = req.body;
    const report = new Report({ title, description, location, photoUrl });
    const savedReport = await report.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
