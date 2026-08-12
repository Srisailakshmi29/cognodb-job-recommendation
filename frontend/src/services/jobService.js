const API_URL = "http://localhost:5000/api";

export async function getRecommendations(userId) {
    try {
        const response = await fetch(
            `${API_URL}/recommendations/${userId}`
        );

        console.log("API status:", response.status);

        if (!response.ok) {
            throw new Error(
                `API request failed with status ${response.status}`
            );
        }

        const data = await response.json();

        console.log("API data:", data);

        return data;

    } catch (error) {
        console.error("Recommendation API error:", error);
        throw error;
    }
}

export async function getJobs() {
    const response = await fetch(`${API_URL}/jobs`);

    if (!response.ok) {
        throw new Error("Failed to fetch jobs");
    }

    return response.json();
}

export async function getJobById(jobId) {
    const response = await fetch(`${API_URL}/jobs/${jobId}`);

    if (!response.ok) {
        throw new Error("Failed to fetch job details");
    }

    return response.json();
}