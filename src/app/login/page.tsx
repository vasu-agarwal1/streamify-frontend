"use client";

import  { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { login } from "@/store/authSlice";
import apiClient from "@/helpers/axiosInstance";


export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch()

  const router = useRouter();

  const loginUser = async (data: any) => {
    try {
      setError("");
      setLoading(true);
      
      const response = await apiClient.post("/users/login", data);
      if (response.status !== 200) {
        throw new Error("Login failed");
      }

      const userData = response.data.data.user

      if(!userData) {
        throw new Error("Invalid response from server");
      }
      dispatch(login(userData))

      router.push("/");

    } catch (err: any) {
      console.log("Login Failed", err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-gray-800 bg-gray-900/50 p-8 shadow-2xl backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-gray-400">Sign in to your account</p>
        </div>

        {error && (
          <div className="rounded bg-red-500/10 p-3 text-center text-sm text-red-500 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(loginUser)} className="space-y-6">
          
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Email or Username
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              type="text"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 p-3 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              placeholder="Enter your email..."
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 p-3 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-lg bg-purple-600 p-3 font-bold text-white hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link href="/signup" className="text-purple-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}