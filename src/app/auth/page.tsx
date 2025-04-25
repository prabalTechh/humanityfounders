"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WaveBackground, WaveBackground2 } from "@/components/svg";
import Google from "@/components/svg/Google";
import Facebook from "@/components/svg/Facebook";
import X from "@/components/svg/X";
import Linkedin from "@/components/svg/LinkedIn";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicLinkEmail, setMagicLinkEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });
      
      console.log("Login successful:", response.data);
      
      // Redirect to platform dashboard
      router.push("/platform");
      
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific error responses from the API
      if (error.response) {
        setError(error.response.data.message || "Invalid credentials");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLinkSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!magicLinkEmail) {
      setError("Email is required for magic link");
      return;
    }
    
    try {
      setLoading(true);
      
      // Send magic link email
      const response = await axios.post("/api/auth/magic-link", {
        email: magicLinkEmail,
      });
      
      // Show success message
      setMagicLinkSent(true);
      
    } catch (error: any) {
      console.error("Magic link error:", error);
      
      if (error.response) {
        setError(error.response.data.message || "Failed to send magic link");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignupClick = () => {
    router.push("/signup");
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      // You would implement social login logic here
      console.log(`Logging in with ${provider}`);
      
      // Example: redirect to provider auth page
      // router.push(`/api/auth/${provider}`);
    } catch (error) {
      console.error(`${provider} login error:`, error);
      setError(`Failed to login with ${provider}`);
    }
  };

  return (
    <div className="min-h-screen text-sm py-4 flex flex-col items-center max-w-screen justify-center bg-[#F5F5F5] relative ">
      {/* Wave backgrounds */}
      
      <div className="text-center space-y-2  mb-4">
        <h1 className="text-3xl font-semibold text-[#333333] ">
          Login to ReferralHub
        </h1>
        <p className="text-sm text-[#666666]">
          Please enter your details to sign in
        </p>
      </div>
      <div className="min-w-md lg:min-w-lg bg-white rounded-2xl shadow-lg py-5 px-10 relative z-10">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {magicLinkSent && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Magic link sent! Please check your email.
          </div>
        )}
        
        <div className="space-y-2 text-sm">
          <Button 
            className="w-full px-4 rounded-lg py-3 border-2 border-[#4F46E5] text-[#4F46E5]"
            onClick={() => handleSocialLogin("google")}
            disabled={loading}
          >
            Continue with Google/Microsoft
          </Button>
          <div>
            <label
              htmlFor="magicLinkEmail"
              className="block text-sm font-medium text-[#333333] mb-2"
            >
              Magic Link login
            </label>
            <input
              type="email"
              id="magicLinkEmail"
              value={magicLinkEmail}
              onChange={(e) => setMagicLinkEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[#CCCCCC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent text-[#333333] placeholder-[#B3B3B3]"
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            type="button"
            onClick={handleMagicLinkSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-700/80 to-[#B5D2FF] text-white py-3 px-4 rounded-lg hover:from-[#4338CA] hover:to-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 transition-colors font-medium disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#CCCCCC]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#666666]">or</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#333333] mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#CCCCCC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent text-[#333333] placeholder-[#B3B3B3]"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#333333] mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#CCCCCC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent text-[#333333] placeholder-[#B3B3B3]"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-[#4F46E5] border-[#CCCCCC] rounded focus:ring-[#4F46E5]"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-[#666666]"
              >
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-[#4F46E5] hover:text-[#4338CA]">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-700/80 to-[#B5D2FF] text-white py-3 px-4 rounded-lg hover:from-[#4338CA] hover:to-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 transition-colors font-medium disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#CCCCCC]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#666666]">or</span>
            </div>
          </div>

          <div className="container inline-flex  items-center justify-center gap-4 ">
            <button 
              type="button" 
              className="flex items-center justify-center size-12 rounded-full hover:bg-[#E5E5E5] transition-colors"
              onClick={() => handleSocialLogin("google")}
            >
              <Google />
            </button>
            <button 
              type="button" 
              className="flex items-center justify-center size-12 rounded-full hover:bg-[#E5E5E5] transition-colors"
              onClick={() => handleSocialLogin("facebook")}
            >
              <Facebook />
            </button>
            <button 
              type="button" 
              className="flex items-center justify-center size-12 rounded-full hover:bg-[#E5E5E5] transition-colors"
              onClick={() => handleSocialLogin("twitter")}
            >
              <X />
            </button>
            <button 
              type="button" 
              className="flex items-center justify-center size-12 rounded-full hover:bg-[#E5E5E5] transition-colors"
              onClick={() => handleSocialLogin("linkedin")}
            >
              <Linkedin />
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-[#666666]">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-[#4F46E5] hover:text-[#4338CA]"
                onClick={handleSignupClick}
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
      <div className="fixed top-0 left-0 w-screen  hidden lg:block">
        <WaveBackground2 className="absolute top-[60px] w-full   " />
        <WaveBackground className="absolute top-[280px] w-full " />
      </div>
    </div>
  );
}