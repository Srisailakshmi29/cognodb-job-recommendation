import { useEffect, useState } from "react";
import { getRecommendations } from "./services/jobService";

function App() {
    const [recommendations, setRecommendations] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [userId, setUserId] = useState("U001");

    // Filter jobs based on search text
    const filteredJobs = recommendations.filter((job) =>
        job.jobTitle.toLowerCase().includes(search.toLowerCase())
    );

    // Load recommendations
    useEffect(() => {
        async function loadRecommendations() {
            setLoading(true);
            setError("");

            try {
                const data = await getRecommendations(userId);
                setRecommendations(data.recommendations);
            } catch (error) {
                console.error(error);
                setError("Unable to load job recommendations.");
            } finally {
                setLoading(false);
            }
        }

        loadRecommendations();
    }, [userId]);

    return (
        <div style={styles.page}>

            {/* Header */}
            <header style={styles.header}>
                <h1>🚀 Job Recommendation System</h1>
                <p>Powered by CognoDB Graph Database</p>
            </header>

            <main style={styles.container}>

                {/* User Selection */}
                <section style={styles.userBox}>
                    <h2>Job Recommendations 👋</h2>

                    <label style={styles.label}>
                        Select User:
                    </label>

                    <select
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        style={styles.select}
                    >
                        <option value="U001">Sai</option>
                    </select>

                    <p>
                        Here are the jobs recommended based on your skills.
                    </p>
                </section>

                {/* Search */}
                <section style={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="🔍 Search jobs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={styles.searchInput}
                    />
                </section>

                {/* Title */}
                <h2 style={styles.title}>
                    Recommended Jobs
                </h2>

                {/* Loading */}
                {loading && (
                    <p style={styles.message}>
                        Loading recommendations...
                    </p>
                )}

                {/* Error */}
                {error && (
                    <p style={styles.error}>
                        {error}
                    </p>
                )}

                {/* No recommendations */}
                {!loading &&
                    !error &&
                    recommendations.length === 0 && (
                        <p style={styles.message}>
                            No job recommendations found.
                        </p>
                    )}

                {/* No search results */}
                {!loading &&
                    !error &&
                    recommendations.length > 0 &&
                    filteredJobs.length === 0 && (
                        <p style={styles.message}>
                            No jobs found for "{search}".
                        </p>
                    )}

                {/* Job Cards */}
                <div style={styles.jobsGrid}>
                    {filteredJobs.map((job) => (
                        <div
                            key={job.jobId}
                            style={styles.card}
                        >

                            {/* Job Title */}
                            <h3 style={styles.jobTitle}>
                                {job.jobTitle}
                            </h3>

                            {/* Salary */}
                            <p>
                                <strong>💰 Salary:</strong>{" "}
                                {job.salary}
                            </p>

                            {/* Experience */}
                            <p>
                                <strong>👤 Experience:</strong>{" "}
                                {job.experience}
                            </p>

                            {/* Matching Skills */}
                            <p>
                                <strong>⭐ Matching Skills:</strong>
                            </p>

                            <div style={styles.skills}>
                                {job.matchingSkills.map((skill) => (
                                    <span
                                        key={skill}
                                        style={styles.skill}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* Match Count */}
                            <div style={styles.match}>
                                🎯 Match: {job.matchCount} skill
                                {job.matchCount !== 1 ? "s" : ""}
                            </div>

                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
}

const styles = {

    page: {
        minHeight: "100vh",
        backgroundColor: "#f4f7fb",
        fontFamily: "Arial, sans-serif",
        color: "#1f2937"
    },

    header: {
        backgroundColor: "#1e293b",
        color: "white",
        textAlign: "center",
        padding: "30px 20px"
    },

    container: {
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "30px 20px"
    },

    userBox: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    },

    label: {
        display: "block",
        fontWeight: "bold",
        marginBottom: "8px"
    },

    select: {
        width: "250px",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "16px",
        marginBottom: "15px",
        backgroundColor: "white"
    },

    searchBox: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "25px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    },

    searchInput: {
        width: "100%",
        padding: "12px 15px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "16px",
        boxSizing: "border-box",
        outline: "none"
    },

    title: {
        marginBottom: "20px"
    },

    jobsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px"
    },

    card: {
        backgroundColor: "white",
        padding: "22px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        transition: "transform 0.2s ease"
    },

    jobTitle: {
        fontSize: "20px",
        marginBottom: "18px"
    },

    skills: {
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        marginBottom: "18px"
    },

    skill: {
        backgroundColor: "#e0e7ff",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "14px"
    },

    match: {
        fontWeight: "bold",
        marginTop: "10px",
        paddingTop: "10px",
        borderTop: "1px solid #eee"
    },

    message: {
        textAlign: "center",
        padding: "30px",
        fontSize: "18px"
    },

    error: {
        textAlign: "center",
        padding: "20px",
        color: "red",
        fontSize: "18px"
    }
};

export default App;