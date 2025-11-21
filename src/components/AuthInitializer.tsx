"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "@/store/authSlice";
import apiClient from "@/helpers/axiosInstance";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // 1. Ask the backend: "Who am I?"
                // We rely on the httpOnly cookie being sent automatically
                const response = await apiClient.post("/users/get-user");
                
                if (response.data && response.data.data) {
                    // 2. Backend recognized the cookie! Restore Redux.
                    dispatch(login(response.data.data));
                }
            } catch (error) {
                // 3. If error (401 Unauthorized), user is definitely logged out
                console.log("User not logged in (Session check failed)", error);
                dispatch(logout());
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [dispatch]);

    if (loading) {
        // Optional: Show a black screen or loading spinner while checking auth
        return <div className="min-h-screen bg-black text-white flex justify-center items-center">Loading VideoTube...</div>;
    }

    return <>{children}</>;
}