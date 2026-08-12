const {
    getAllJobs,
    getJobById,
    getRecommendations
} = require("../services/jobService");

// Get all jobs
async function getJobs(req, res) {
    try {
        const jobs = await getAllJobs();

        res.json({
            success: true,
            jobs
        });

    } catch (error) {
        console.error("Error fetching jobs:", error);

        res.status(500).json({
            success: false,
            message: "Could not fetch jobs",
            error: error.message
        });
    }
}

// Get job by ID
async function getJob(req, res) {
    try {
        const { jobId } = req.params;

        const job = await getJobById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        res.json({
            success: true,
            job
        });

    } catch (error) {
        console.error("Error fetching job:", error);

        res.status(500).json({
            success: false,
            message: "Could not fetch job",
            error: error.message
        });
    }
}

// Get recommendations
async function getJobRecommendations(req, res) {
    try {
        const { userId } = req.params;

        const recommendations = await getRecommendations(userId);

        res.json({
            success: true,
            userId,
            recommendations
        });

    } catch (error) {
        console.error("Recommendation error:", error);

        res.status(500).json({
            success: false,
            message: "Could not generate recommendations",
            error: error.message
        });
    }
}

module.exports = {
    getJobs,
    getJob,
    getJobRecommendations
};