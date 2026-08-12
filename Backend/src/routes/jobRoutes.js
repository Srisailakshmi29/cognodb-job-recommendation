const express = require("express");

const {
    getJobs,
    getJob,
    getJobRecommendations
} = require("../controllers/jobController");

const router = express.Router();

// Get all jobs
router.get("/jobs", getJobs);

// Get job details
router.get("/jobs/:jobId", getJob);

// Get job recommendations
router.get("/recommendations/:userId", getJobRecommendations);

module.exports = router;