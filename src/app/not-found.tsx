"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

export default function NotFound() {
  const router = useRouter();
  const { authenticated } = usePrivy();

  const handleGoHome = () => {
    if (authenticated) {
      router.push("/app");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center w-[480px]">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
          <p className="text-gray-400 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <Button 
            className="h-12 font-bold cursor-pointer" 
            onClick={handleGoHome}
          >
            {authenticated ? "Go to App" : "Go to Login"}
          </Button>
          
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
