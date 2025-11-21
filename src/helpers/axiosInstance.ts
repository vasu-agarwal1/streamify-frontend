import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URI,
    withCredentials: true, // CRITICAL: This allows the backend to set cookies
    timeout: 120000, // Wait 2 mins before failing (Render free tier is slow)
});

export default apiClient;