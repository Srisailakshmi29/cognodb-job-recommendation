const API_URL = "https://cognodb-backend.onrender.com";

export async function getRecommendations(userId) {
    try {
        const response = await fetch(
            `${API_URL}/api/recommendations/${userId}`
        );

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();

        console.log("Recommendation API response:", data);

        return data;
    } catch (error) {
        console.error("Recommendation API error:", error);
        throw error;
    }
}