import Image from "next/image";
import Link from "next/link";

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
        
        <p className="text-xl md:text-2xl text-zinc-300 mb-8">
          We are working on something amazing. Stay tuned.
        </p>

        <Link 
          href="https://wagus-app.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-black bg-white hover:bg-zinc-200 border border-white rounded-md transition-colors duration-200"
        >
          Visit Wagus App
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="ml-2 h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </main>
      
      <footer className="absolute bottom-8 text-zinc-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Wagus. All rights reserved.</p>
      </footer>
    </div>
  );
}
