 CognoDB Job Recommendation System

## 1. Project Overview

The CognoDB Job Recommendation System is a graph-based web application that recommends suitable jobs to users based on their skills.

The system stores users, skills, and jobs in a CognoDB graph database. It identifies the skills associated with a user, finds jobs that require those skills, and ranks the recommended jobs based on the number of matching skills.

The application consists of:

- React frontend
- Node.js and Express.js backend
- CognoDB graph database
- Cypher queries for graph traversal and recommendations

---
### Live Application

**Frontend:**

https://YOUR-FRONTEND-URL.onrender.com

**Backend:**

https://cognodb-backend.onrender.com

**Recommendation API:**

https://cognodb-backend.onrender.com/api/recommendations/U001

---

## 2. Why CognoDB / Graph Database?

A graph database is suitable for this application because users, skills, and jobs are naturally connected through relationships.

The main graph structure is:

User → HAS_SKILL → Skill ← REQUIRES ← Job

This allows the application to efficiently traverse relationships between a user and the jobs that require the user's skills.

For example, if a user has Java and SQL skills, the system can find jobs requiring Java and SQL and calculate how many skills match.

The graph approach makes relationship-based recommendations straightforward using Cypher queries.

---

## 3. Features

- User-based job recommendations
- Skill-based job matching
- Job search
- Matching skill display
- Match count
- Salary information
- Experience information
- CognoDB cloud database integration
- REST API backend
- React-based frontend

---

## 4. Technology Stack

### Frontend

- React
- JavaScript
- Vite
- HTML
- CSS

### Backend

- Node.js
- Express.js
- REST API
- CORS
- dotenv

### Database

- CognoDB
- Cypher Query Language

---

## 5. Data Model

The application uses the following graph data model:

```text
(User)
   |
   | HAS_SKILL
   ↓
(Skill)
   ↑
   | REQUIRES
   |
(Job)
Nodes
User

Represents a job seeker.

Example:

User
id: U001
name: Sai
Skill

Represents a technical skill.

Examples:

Java
Python
React
SQL
Job

Represents an available job.

Example:

Job
id: J001
title: Java Developer
experience: Fresher
salary: 6-10 LPA
Relationships
User → HAS_SKILL → Skill

Connects a user with their skills.

Job → REQUIRES → Skill

Connects a job with the skills required for that job.

6. Recommendation Logic

The recommendation system performs a graph traversal from the user to their skills and then from those skills to jobs.

The process is:

User
  ↓
HAS_SKILL
  ↓
Skill
  ↑
REQUIRES
  ↑
Job

The system collects the matching skills for every job and counts the number of matching skills.

Jobs are ordered by the number of matching skills in descending order.

For example:

User: Sai

Matching Skills:
Java
SQL
React

Recommended Jobs:
1. Java Developer
2. Frontend Developer
3. Full Stack Developer
4. Backend Developer
5. Python Developer
7. Main Cypher Query

The recommendation query uses a multi-hop graph traversal:

MATCH (u:User {id: $userId})
      -[:HAS_SKILL]->(s:Skill)
      <-[:REQUIRES]-(j:Job)

WITH u, j,
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
Query Explanation
Finds the user using their user ID.
Traverses from the user to their skills.
Finds jobs that require those skills.
Collects matching skills.
Counts matching skills.
Returns job information.
Orders jobs by the number of matching skills.
8. Backend API
Test CognoDB Connection
GET /api/test-db

Example:

http://localhost:5000/api/test-db
Get All Jobs
GET /api/jobs

Example:

http://localhost:5000/api/jobs
Get Job by ID
GET /api/jobs/:jobId

Example:

http://localhost:5000/api/jobs/J001
Get Job Recommendations
GET /api/recommendations/:userId

Example:

http://localhost:5000/api/recommendations/U001
9. Example Recommendation Response

For user U001, the system returns job recommendations with matching skills.

Example:

{
  "success": true,
  "userId": "U001",
  "recommendations": [
    {
      "user": "Sai",
      "jobId": "J001",
      "jobTitle": "Java Developer",
      "experience": "Fresher",
      "salary": "6-10 LPA",
      "matchingSkills": ["Java", "SQL"],
      "matchCount": 2
    }
  ]
}
10. Project Structure
cognodb-job-recommendation/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   │
│   ├── seed/
│   │   └── seed.js
│   │
│   ├── queries/
│   │   └── queries.cypher
│   │
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── screenshots/
│
├── .gitignore
└── README.md
11. Environment Variables

The backend uses environment variables for CognoDB credentials.

Create a .env file inside the Backend folder:

COGNODB_URI=your_cognodb_connection_uri
COGNODB_USERNAME=your_username
COGNODB_PASSWORD=your_password
PORT=5000

The .env file must not be committed to GitHub.

A .env.example file is provided with placeholder values.

12. Backend Installation

Open a terminal in the project folder.

cd Backend

Install dependencies:

npm install

Start the backend:

npm run dev

The backend runs on:

http://localhost:5000
13. Frontend Installation

Open another terminal.

cd frontend

Install dependencies:

npm install

Start the frontend:

npm run dev

The frontend runs on:

http://localhost:5173
14. Database Seeding

The database can be populated using the seed script.

From the Backend folder:

node seed/seed.js

The seed script creates the users, skills, jobs, and relationships required by the application.

15. Screenshots
CognoDB Instance

Backend API

Frontend Application

Job Search

16. Application Flow
User
  ↓
React Frontend
  ↓
Express REST API
  ↓
Recommendation Service
  ↓
CognoDB
  ↓
Cypher Graph Query
  ↓
Matching Jobs
  ↓
React Frontend
17. Future Improvements
Add more users and jobs
Add more technical skills
Improve recommendation ranking
Add authentication
Add job application tracking
Add advanced filtering
Add job location and company informatio