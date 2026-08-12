const driver = require("../config/database");

// Get all jobs
async function getAllJobs() {
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

        return result.records.map(record => ({
            jobId: record.get("jobId"),
            jobTitle: record.get("jobTitle"),
            experience: record.get("experience"),
            salary: record.get("salary")
        }));

    } finally {
        await session.close();
    }
}

// Get one job with company, location and skills
async function getJobById(jobId) {
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
            return null;
        }

        const record = result.records[0];

        return {
            jobId: record.get("jobId"),
            jobTitle: record.get("jobTitle"),
            experience: record.get("experience"),
            salary: record.get("salary"),
            company: record.get("company"),
            location: record.get("location"),
            requiredSkills: record.get("requiredSkills")
        };

    } finally {
        await session.close();
    }
}

// Get job recommendations for a user
async function getRecommendations(userId) {
    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (u:User {id: $userId})
                  -[:HAS_SKILL]->(s:Skill)
                  <-[:REQUIRES]-(j:Job)

            WITH
                u,
                j,
                collect(s.name) AS matchingSkills,
                count(s) AS matchCount

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

        return result.records.map(record => ({
            user: record.get("user"),
            jobId: record.get("jobId"),
            jobTitle: record.get("jobTitle"),
            experience: record.get("experience"),
            salary: record.get("salary"),
            matchingSkills: record.get("matchingSkills"),
            matchCount: record.get("matchCount").toNumber()
        }));

    } finally {
        await session.close();
    }
}

module.exports = {
    getAllJobs,
    getJobById,
    getRecommendations
};