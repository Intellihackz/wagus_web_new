import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
      <main className="flex flex-col gap-8 items-center text-center max-w-4xl">
        <Image
          src="/logo.png"
          alt="Wagus Logo"
          width={250}
          height={250}
          priority
          className="animate-pulse-slow invert"
        />

        <h1 className="text-5xl md:text-7xl font-bold tracking-wider text-white mb-6">
          COMING SOON
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          We are working on something amazing. Stay tuned.
        </p>

      </main>
      
      <footer className="absolute bottom-8 text-white/50 text-sm">
        <p>&copy; {new Date().getFullYear()} Wagus. All rights reserved.</p>
      </footer>
    </div>
  );
}
