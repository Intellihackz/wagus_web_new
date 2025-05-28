"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginWithEmail, usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { sendCode } = useLoginWithEmail();
  const { authenticated } = usePrivy();
  const router = useRouter();

  // Redirect to app if already authenticated
  useEffect(() => {
    if (authenticated) {
      router.push("/app");
    }
  }, [authenticated, router]);

  // Show loading while checking authentication or redirecting
  if (authenticated) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Redirecting to app...</p>
        </div>
      </div>
    );
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendCode = async () => {
    setError("");
    
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    try {
      await sendCode({ email });
      // Store email in sessionStorage for the verify page
      sessionStorage.setItem('verifyEmail', email);
      // Navigate to clean verify URL without query params
      router.push('/verify');
    } catch (error) {
      console.error("Error sending code:", error);
      setError("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center w-[480px]">
        <h1 className="mb-6 text-xl font-bold">Enter your email to login</h1>
        <div className="flex flex-col gap-4">
          <Input 
            className="h-12" 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />
          {error && <p className="text-red-500 text-sm text-left">{error}</p>}
          <Button 
            className="h-12 font-bold cursor-pointer" 
            onClick={handleSendCode}
            disabled={!email || isLoading}
          >
            {isLoading ? "Sending..." : "Continue with Email"}
          </Button>
        </div>
      </div>
    </div>
  );
}
