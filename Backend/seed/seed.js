const neo4j = require("neo4j-driver");
require("dotenv").config();

const driver = neo4j.driver(
    process.env.COGNODB_URI,
    neo4j.auth.basic(
        process.env.COGNODB_USERNAME,
        process.env.COGNODB_PASSWORD
    )
);

async function seedDatabase() {
    const session = driver.session();

    try {
        console.log("Connecting to CognoDB...");

        // Clear existing data
        await session.run("MATCH (n) DETACH DELETE n");

        console.log("Existing data cleared.");

        // Create Skills
        await session.run(`
            CREATE
            (:Skill {name: "Java"}),
            (:Skill {name: "Python"}),
            (:Skill {name: "JavaScript"}),
            (:Skill {name: "React"}),
            (:Skill {name: "Node.js"}),
            (:Skill {name: "SQL"}),
            (:Skill {name: "MongoDB"}),
            (:Skill {name: "Spring Boot"}),
            (:Skill {name: "AWS"}),
            (:Skill {name: "Docker"})
        `);

        console.log("Skills created.");

        // Create Locations
        await session.run(`
            CREATE
            (:Location {name: "Bangalore"}),
            (:Location {name: "Hyderabad"}),
            (:Location {name: "Chennai"}),
            (:Location {name: "Pune"}),
            (:Location {name: "Remote"})
        `);

        console.log("Locations created.");

        // Create Companies
        await session.run(`
            CREATE
            (:Company {name: "Amazon"}),
            (:Company {name: "Microsoft"}),
            (:Company {name: "Infosys"}),
            (:Company {name: "TCS"}),
            (:Company {name: "Wipro"})
        `);

        console.log("Companies created.");

        // Create Users
        await session.run(`
            CREATE
            (:User {
                id: "U001",
                name: "Sai",
                email: "sai@example.com"
            }),
            (:User {
                id: "U002",
                name: "Rahul",
                email: "rahul@example.com"
            }),
            (:User {
                id: "U003",
                name: "Priya",
                email: "priya@example.com"
            })
        `);

        console.log("Users created.");

        // Create Jobs
        await session.run(`
            CREATE
            (:Job {
                id: "J001",
                title: "Java Developer",
                experience: "Fresher",
                salary: "6-10 LPA"
            }),
            (:Job {
                id: "J002",
                title: "Frontend Developer",
                experience: "Fresher",
                salary: "5-8 LPA"
            }),
            (:Job {
                id: "J003",
                title: "Backend Developer",
                experience: "Fresher",
                salary: "6-10 LPA"
            }),
            (:Job {
                id: "J004",
                title: "Full Stack Developer",
                experience: "Fresher",
                salary: "7-12 LPA"
            }),
            (:Job {
                id: "J005",
                title: "Python Developer",
                experience: "Fresher",
                salary: "5-9 LPA"
            })
        `);

        console.log("Jobs created.");

        // User -> Skill relationships
        await session.run(`
            MATCH (u:User {id: "U001"})
            MATCH (java:Skill {name: "Java"})
            MATCH (sql:Skill {name: "SQL"})
            MATCH (react:Skill {name: "React"})
            CREATE
                (u)-[:HAS_SKILL]->(java),
                (u)-[:HAS_SKILL]->(sql),
                (u)-[:HAS_SKILL]->(react)
        `);

        await session.run(`
            MATCH (u:User {id: "U002"})
            MATCH (python:Skill {name: "Python"})
            MATCH (sql:Skill {name: "SQL"})
            MATCH (mongo:Skill {name: "MongoDB"})
            CREATE
                (u)-[:HAS_SKILL]->(python),
                (u)-[:HAS_SKILL]->(sql),
                (u)-[:HAS_SKILL]->(mongo)
        `);

        await session.run(`
            MATCH (u:User {id: "U003"})
            MATCH (java:Skill {name: "Java"})
            MATCH (spring:Skill {name: "Spring Boot"})
            MATCH (aws:Skill {name: "AWS"})
            CREATE
                (u)-[:HAS_SKILL]->(java),
                (u)-[:HAS_SKILL]->(spring),
                (u)-[:HAS_SKILL]->(aws)
        `);

        console.log("User skills connected.");

        // Job -> Skill relationships
        await session.run(`
            MATCH (j:Job {id: "J001"})
            MATCH (java:Skill {name: "Java"})
            MATCH (sql:Skill {name: "SQL"})
            MATCH (spring:Skill {name: "Spring Boot"})
            CREATE
                (j)-[:REQUIRES {level: "intermediate"}]->(java),
                (j)-[:REQUIRES {level: "intermediate"}]->(sql),
                (j)-[:REQUIRES {level: "intermediate"}]->(spring)
        `);

        await session.run(`
            MATCH (j:Job {id: "J002"})
            MATCH (react:Skill {name: "React"})
            MATCH (js:Skill {name: "JavaScript"})
            MATCH (sql:Skill {name: "SQL"})
            CREATE
                (j)-[:REQUIRES {level: "intermediate"}]->(react),
                (j)-[:REQUIRES {level: "intermediate"}]->(js),
                (j)-[:REQUIRES {level: "beginner"}]->(sql)
        `);

        await session.run(`
            MATCH (j:Job {id: "J003"})
            MATCH (node:Skill {name: "Node.js"})
            MATCH (mongo:Skill {name: "MongoDB"})
            MATCH (sql:Skill {name: "SQL"})
            CREATE
                (j)-[:REQUIRES {level: "intermediate"}]->(node),
                (j)-[:REQUIRES {level: "intermediate"}]->(mongo),
                (j)-[:REQUIRES {level: "intermediate"}]->(sql)
        `);

        await session.run(`
            MATCH (j:Job {id: "J004"})
            MATCH (react:Skill {name: "React"})
            MATCH (node:Skill {name: "Node.js"})
            MATCH (mongo:Skill {name: "MongoDB"})
            MATCH (js:Skill {name: "JavaScript"})
            CREATE
                (j)-[:REQUIRES {level: "intermediate"}]->(react),
                (j)-[:REQUIRES {level: "intermediate"}]->(node),
                (j)-[:REQUIRES {level: "intermediate"}]->(mongo),
                (j)-[:REQUIRES {level: "intermediate"}]->(js)
        `);

        await session.run(`
            MATCH (j:Job {id: "J005"})
            MATCH (python:Skill {name: "Python"})
            MATCH (sql:Skill {name: "SQL"})
            MATCH (aws:Skill {name: "AWS"})
            CREATE
                (j)-[:REQUIRES {level: "intermediate"}]->(python),
                (j)-[:REQUIRES {level: "intermediate"}]->(sql),
                (j)-[:REQUIRES {level: "beginner"}]->(aws)
        `);

        console.log("Job requirements connected.");

        // Company -> Job relationships
        await session.run(`
            MATCH (c:Company {name: "Amazon"})
            MATCH (j:Job {id: "J001"})
            CREATE (c)-[:POSTS]->(j)
        `);

        await session.run(`
            MATCH (c:Company {name: "Microsoft"})
            MATCH (j:Job {id: "J002"})
            CREATE (c)-[:POSTS]->(j)
        `);

        await session.run(`
            MATCH (c:Company {name: "Infosys"})
            MATCH (j:Job {id: "J003"})
            CREATE (c)-[:POSTS]->(j)
        `);

        await session.run(`
            MATCH (c:Company {name: "TCS"})
            MATCH (j:Job {id: "J004"})
            CREATE (c)-[:POSTS]->(j)
        `);

        await session.run(`
            MATCH (c:Company {name: "Wipro"})
            MATCH (j:Job {id: "J005"})
            CREATE (c)-[:POSTS]->(j)
        `);

        console.log("Companies connected to jobs.");

        // Job -> Location relationships
        await session.run(`
            MATCH (j:Job {id: "J001"})
            MATCH (l:Location {name: "Bangalore"})
            CREATE (j)-[:LOCATED_IN]->(l)
        `);

        await session.run(`
            MATCH (j:Job {id: "J002"})
            MATCH (l:Location {name: "Hyderabad"})
            CREATE (j)-[:LOCATED_IN]->(l)
        `);

        await session.run(`
            MATCH (j:Job {id: "J003"})
            MATCH (l:Location {name: "Chennai"})
            CREATE (j)-[:LOCATED_IN]->(l)
        `);

        await session.run(`
            MATCH (j:Job {id: "J004"})
            MATCH (l:Location {name: "Pune"})
            CREATE (j)-[:LOCATED_IN]->(l)
        `);

        await session.run(`
            MATCH (j:Job {id: "J005"})
            MATCH (l:Location {name: "Remote"})
            CREATE (j)-[:LOCATED_IN]->(l)
        `);

        console.log("Job locations connected.");

        console.log("=================================");
        console.log("Database seeding completed!");
        console.log("=================================");

    } catch (error) {
        console.error("Error while seeding database:");
        console.error(error);
    } finally {
        await session.close();
        await driver.close();
    }
}

seedDatabase();