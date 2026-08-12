// =====================================================
// QUERY 1: Get all available jobs
// =====================================================

MATCH (j:Job)
RETURN
    j.id AS jobId,
    j.title AS jobTitle,
    j.experience AS experience,
    j.salary AS salary
ORDER BY j.title;


// =====================================================
// QUERY 2: Get complete job details
// Company + Job + Skills + Location
// =====================================================

MATCH (c:Company)-[:POSTS]->(j:Job)-[:REQUIRES]->(s:Skill)
MATCH (j)-[:LOCATED_IN]->(l:Location)
WHERE j.id = "J001"
RETURN
    j.id AS jobId,
    j.title AS jobTitle,
    j.experience AS experience,
    j.salary AS salary,
    c.name AS company,
    l.name AS location,
    collect(s.name) AS requiredSkills;


// =====================================================
// QUERY 3: Multi-hop job recommendation
// User -> Skill <- Job
// =====================================================

MATCH (u:User {id: "U001"})
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

ORDER BY matchCount DESC;