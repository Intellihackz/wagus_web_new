import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center w-[480px]">
        <h1 className="mb-6 text-xl font-bold">Enter your email to login</h1>
        <div className="flex flex-col gap-4">
          <Input className="h-12" type="email" placeholder="Email" />
          <Button className="h-12 font-bold cursor-pointer ">Continue with Email</Button>
        </div>
      </div>
    </div>
  );
}
