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

  // Redirect to app if already authenticated
  useEffect(() => {
    if (authenticated) {
      // Clear the stored email on successful authentication
      sessionStorage.removeItem('verifyEmail');
      router.push("/app");
    }
  }, [authenticated, router]);

  const handleVerifyCode = async () => {
    if (!code) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      await loginWithCode({ code });
      // The useEffect above will handle the redirect after authentication
    } catch (error) {
      console.error("Error verifying code:", error);
      setError("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show success state if authenticated
  if (authenticated) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center w-[480px]">
          <h1 className="mb-6 text-2xl font-bold">Welcome to WAGUS</h1>
          <Button 
            className="h-12 font-bold cursor-pointer p-6 mb-4"
            onClick={() => router.push("/app")}
          >  
            [  Enter WAGUS  ]
          </Button>
          <p className="text-sm font-bold">Current Tier : Basic</p>
          {user?.wallet?.address && (
            <p className="text-xs text-gray-400 mt-2">
              Wallet: {user.wallet.address.slice(0, 6)}...{user.wallet.address.slice(-4)}
            </p>
          )}
        </div>
      </div>
    );
  }

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
