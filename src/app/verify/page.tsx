"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginWithEmail, usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("your email");
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const { loginWithCode } = useLoginWithEmail();
  const { authenticated, user } = usePrivy();
  const router = useRouter();
  // Get email from sessionStorage on component mount
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('verifyEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email in sessionStorage, redirect back to login
      router.push('/');
    }
  }, [router]);

  // Handle authentication success and countdown
  useEffect(() => {
    if (authenticated && !isVerified) {
      setIsVerified(true);
      // Clear the stored email on successful authentication
      sessionStorage.removeItem('verifyEmail');
    }
  }, [authenticated, isVerified]);

  // Countdown timer for auto-redirect
  useEffect(() => {
    if (isVerified && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isVerified && countdown === 0) {
      router.push("/app");
    }
  }, [isVerified, countdown, router]);

  const handleEnterApp = () => {
    router.push("/app");
  };
  // Show success screen if verified
  if (isVerified) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center w-[480px]">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold mb-2">Email Verified Successfully!</h1>
            <p className="text-gray-400 text-sm mb-6">Welcome to Wagus. You can now access your account.</p>
          </div>
          
          <div className="flex flex-col gap-4">
            <Button
              className="h-12 font-bold cursor-pointer bg-purple-600 hover:bg-purple-700"
              onClick={handleEnterApp}
            >
              Enter App
            </Button>
            
            <p className="text-sm text-gray-400">
              Auto-redirecting in {countdown} seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }  const handleVerifyCode = async () => {
    if (!code) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      await loginWithCode({ code });
      // The useEffect above will handle setting isVerified and starting countdown
    } catch (error) {
      console.error("Error verifying code:", error);
      setError("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center w-[480px]">
        <h1 className="mb-3 text-xl font-bold">
          Enter the verification code sent to
        </h1>
        <h1 className="mb-6 text-sm font-bold">{email}</h1>
        <div className="flex flex-col gap-4">
          <Input
            className="h-12"
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}          <Button
            className="h-12 font-bold cursor-pointer"
            onClick={handleVerifyCode}
            disabled={!code || isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
          <button
            onClick={() => {
              sessionStorage.removeItem('verifyEmail');
              router.push('/');
            }}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Back to Email
          </button>
        </div>
      </div>
    </div>
  );
}
