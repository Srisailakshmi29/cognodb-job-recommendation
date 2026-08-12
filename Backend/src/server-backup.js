const express = require("express");
const cors = require("cors");
require("dotenv").config();

const driver = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

// Home
app.get("/", (req, res) => {
    res.json({
        message: "CognoDB Job Recommendation API is running"
    });
});

// Test CognoDB connection
app.get("/api/test-db", async (req, res) => {
    const session = driver.session();

    try {
        const result = await session.run(
            "RETURN 'CognoDB Connected!' AS message"
        );

        res.json({
            success: true,
            message: result.records[0].get("message")
        });
    } catch (error) {
        console.error("Database connection error:", error);

        res.status(500).json({
            success: false,
            message: "Could not connect to CognoDB",
            error: error.message
        });
    } finally {
        await session.close();
    }
});

// Count nodes
app.get("/api/count", async (req, res) => {
    const session = driver.session();

    try {
        const result = await session.run(
            "MATCH (n) RETURN count(n) AS totalNodes"
        );

        const totalNodes = result.records[0]
            .get("totalNodes")
            .toNumber();

        res.json({
            success: true,
            totalNodes
        });

    } catch (error) {
        console.error("Error counting nodes:", error);

        res.status(500).json({
            success: false,
            message: "Could not count nodes",
            error: error.message
        });

    } finally {
        await session.close();
    }
});
// Get all jobs
app.get("/api/jobs", async (req, res) => {
    const session = driver.session();

    try {
        const result = await session.run(`
            MATCH (j:Job)
            RETURN
                j.id AS jobId,
                j.title AS jobTitle,
                j.experience AS experience,
                j.salary AS salary
            ORDER BY j.title
        `);

        const jobs = result.records.map(record => ({
            jobId: record.get("jobId"),
            jobTitle: record.get("jobTitle"),
            experience: record.get("experience"),
            salary: record.get("salary")
        }));

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

    } finally {
        await session.close();
    }
});
// Get job details
app.get("/api/jobs/:jobId", async (req, res) => {
    const { jobId } = req.params;
    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (c:Company)-[:POSTS]->(j:Job {id: $jobId})
            MATCH (j)-[:REQUIRES]->(s:Skill)
            MATCH (j)-[:LOCATED_IN]->(l:Location)

            RETURN
                j.id AS jobId,
                j.title AS jobTitle,
                j.experience AS experience,
                j.salary AS salary,
                c.name AS company,
                l.name AS location,
                collect(s.name) AS requiredSkills
            `,
            { jobId }
        );

        if (result.records.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        const record = result.records[0];

        res.json({
            success: true,
            job: {
                jobId: record.get("jobId"),
                jobTitle: record.get("jobTitle"),
                experience: record.get("experience"),
                salary: record.get("salary"),
                company: record.get("company"),
                location: record.get("location"),
                requiredSkills: record.get("requiredSkills")
            }
        });

    } catch (error) {
        console.error("Error fetching job details:", error);

        res.status(500).json({
            success: false,
            message: "Could not fetch job details",
            error: error.message
        });

    } finally {
        await session.close();
    }
});


// Job recommendations
app.get("/api/recommendations/:userId", async (req, res) => {
    const { userId } = req.params;
    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (u:User {id: $userId})
                  -[:HAS_SKILL]->(s:Skill)
                  <-[:REQUIRES]-(j:Job)

            WITH u, j, collect(s.name) AS matchingSkills, count(s) AS matchCount

            RETURN
                u.name AS user,
                j.id AS jobId,
                j.title AS jobTitle,
                j.experience AS experience,
                j.salary AS salary,
                matchingSkills,
                matchCount

            ORDER BY matchCount DESC
            `,
            { userId }
        );

        const recommendations = result.records.map(record => ({
            user: record.get("user"),
            jobId: record.get("jobId"),
            jobTitle: record.get("jobTitle"),
            experience: record.get("experience"),
            salary: record.get("salary"),
            matchingSkills: record.get("matchingSkills"),
            matchCount: record.get("matchCount").toNumber()
        }));

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

    } finally {
        await session.close();
    }
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});