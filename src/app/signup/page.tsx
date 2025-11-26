"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from "@/helpers/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const registerUser = async (data: any) => {
    try {
      setError("");
      setLoading(true);

      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("fullName", data.fullName);
      formData.append("password", data.password);
      
      if (data.avatar[0]) {
        formData.append("avatar", data.avatar[0]);
      }
      if (data.coverImage[0]) {
        formData.append("coverImage", data.coverImage[0]);
      }


      await apiClient.post("/users/register", formData);

      router.push("/login");

    } catch (err: any) {
      console.log("Signup Failed", err);
      const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
          <p className="mt-2 text-muted-foreground">Join the community</p>
        </div>

        {error && (
          <div className="rounded bg-destructive/10 p-3 text-center text-sm text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(registerUser)} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
            <Input
              {...register("fullName", { required: "Full name is required" })}
              placeholder="John Doe"
            />
            {errors.fullName && <p className="text-destructive text-xs">{errors.fullName.message as string}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Username</label>
            <Input
              {...register("username", { required: "Username is required" })}
              placeholder="johndoe123"
            />
            {errors.username && <p className="text-destructive text-xs">{errors.username.message as string}</p>}
          </div>


          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <Input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-destructive text-xs">{errors.email.message as string}</p>}
          </div>


          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Password</label>
            <Input
              {...register("password", { required: "Password is required" })}
              type="password"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-destructive text-xs">{errors.password.message as string}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Avatar (Required)</label>
            <Input
              {...register("avatar", { required: "Avatar is required" })}
              type="file"
              accept="image/*"
              className="file:text-foreground"
            />
            {errors.avatar && <p className="text-destructive text-xs">{errors.avatar.message as string}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Cover Image (Optional)</label>
            <Input
              {...register("coverImage")}
              type="file"
              accept="image/*"
              className="file:text-foreground"
            />
          </div>

          <Button disabled={loading} type="submit" className="w-full">
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}