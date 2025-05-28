"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [isVerified, setIsVerified] = useState(false);

  if (isVerified) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center w-[480px]">
          <h1 className="mb-6 text-2xl font-bold">Welcome to WAGUS</h1>
          <Button className="h-12 font-bold cursor-pointer p-6 mb-4" >  
            [  Enter WAGUS  ]
          </Button>
          <p className="text-sm font-bold">Current Tier : Basic</p>
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
        <h1 className="mb-6 text-sm font-bold">zephyrdev@duck.com</h1>
        <div className="flex flex-col gap-4">
          <Input
            className="h-12"
            type="email"
            placeholder="Verification Code"
          />
          <Button
            className="h-12 font-bold cursor-pointer"
            onClick={() => setIsVerified(true)}
          >
            Verify Code
          </Button>
          <Link href={"/"} className="text-sm">
            Back to Email
          </Link>
        </div>
      </div>
    </div>
  );
}
