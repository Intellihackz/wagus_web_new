'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from "next/image";
import { usePrivyAuth } from '@/lib/hooks/use-privy-auth';
import { useLoginWithEmail } from '@privy-io/react-auth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { isValidEmail } from '@/lib/utils/crypto';

// Loading component to display while the main component is loading
function ExportLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
      <p className="text-xl">Loading...</p>
    </div>
  );
}

// Main content component
function ExportPageContent() {
  const { ready } = usePrivyAuth();
  const { sendCode, loginWithCode } = useLoginWithEmail();
  const { exportWallet } = useSolanaWallets();
  
  const [step, setStep] = useState<'enterEmail' | 'verifyCode' | 'verified'>('enterEmail');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      await sendCode({ email });
      setStep('verifyCode');
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerifyCode = async () => {
    try {
      setIsLoading(true);
      setError('');
      await loginWithCode({ code });
      setStep('verified');
    } catch (err) {
      setError('Invalid verification code. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExportSecretKey = () => {
    try {
      exportWallet();
    } catch (err) {
      setError('Failed to export wallet. Please try again.');
      console.error(err);
    }
  };

  // Render content based on verification step
  const renderContent = () => {
    switch (step) {
      case 'enterEmail':
        return (
          <div className="bg-zinc-900 p-6 rounded-lg w-full max-w-md border border-zinc-800">
            <h2 className="text-2xl font-semibold mb-4">Export Your Wallet</h2>
            <p className="text-zinc-300 mb-6">
              Enter your Wagus email address to export your private keys.
            </p>
            
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Enter your email"
              />
            </div>
            
            <button
              className="w-full py-3 px-6 bg-white hover:bg-zinc-200 transition-colors text-black font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSendCode}
              disabled={isLoading || !email}
            >
              {isLoading ? 'Sending...' : 'Continue'}
            </button>
            
            {error && <p className="text-red-400 mt-4">{error}</p>}
          </div>
        );
        
      case 'verifyCode':
        return (
          <div className="bg-zinc-900 p-6 rounded-lg w-full max-w-md border border-zinc-800">
            <h2 className="text-2xl font-semibold mb-4">Verify Your Email</h2>
            <p className="text-zinc-300 mb-6">
              We've sent a verification code to <strong>{email}</strong>. Please check your inbox and enter the code below.
            </p>
            
            <div className="mb-6">
              <label htmlFor="code" className="block text-sm font-medium text-zinc-400 mb-2">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Enter code"
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                className="flex-1 py-3 px-6 bg-zinc-800 hover:bg-zinc-700 transition-colors text-white font-medium rounded-md"
                onClick={() => setStep('enterEmail')}
              >
                Back
              </button>
              <button
                className="flex-1 py-3 px-6 bg-white hover:bg-zinc-200 transition-colors text-black font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleVerifyCode}
                disabled={isLoading || !code}
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>
            
            {error && <p className="text-red-400 mt-4">{error}</p>}
          </div>
        );
        
      case 'verified':
        return (
          <div className="bg-zinc-900 p-6 rounded-lg w-full max-w-md border border-zinc-800">
            <h2 className="text-2xl font-semibold mb-4">Email Verified</h2>
            <p className="text-zinc-300 mb-6">
              Your email has been successfully verified. You can now export your secret key.
            </p>
            
            <button
              className="w-full py-3 px-6 bg-white hover:bg-zinc-200 transition-colors text-black font-medium rounded-md mb-4"
              onClick={handleExportSecretKey}
            >
              Export Secret Key
            </button>

            <button
              className="w-full py-3 px-6 bg-zinc-800 hover:bg-zinc-700 transition-colors text-white font-medium rounded-md"
              onClick={() => {
                setStep('enterEmail');
                setEmail('');
                setCode('');
                setError('');
              }}
            >
              Start Over
            </button>
            
            <p className="text-zinc-400 text-sm mt-4">
              Note: Your secret key gives full access to your wallet. Never share it with anyone.
            </p>
            
            {error && <p className="text-red-400 mt-4">{error}</p>}
          </div>
        );
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
      <main className="flex flex-col gap-8 items-center text-center max-w-4xl">
        <Image
          src="/logo.png"
          alt="Wagus Logo"
          width={150}
          height={150}
          priority
          className="invert"
        />
        
        <div className="flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-white mb-6">
            Wagus Key Export
          </h1>
          
          {step !== 'enterEmail' && (
            <button 
              onClick={() => {
                setStep('enterEmail');
                setEmail('');
                setCode('');
                setError('');
              }}
              className="text-zinc-400 hover:text-white text-sm mb-6 flex items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Restart
            </button>
          )}
        </div>
        
        {renderContent()}
      </main>
      
      <footer className="absolute bottom-8 text-zinc-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Wagus. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Default export that wraps the main content in a Suspense boundary
export default function Home() {
  return (
    <Suspense fallback={<ExportLoading />}>
      <ExportPageContent />
    </Suspense>
  );
}
