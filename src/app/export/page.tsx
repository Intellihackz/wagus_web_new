'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { usePrivyAuth } from '@/lib/hooks/use-privy-auth';
import { useLoginWithEmail } from '@privy-io/react-auth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { decryptEmail, isValidEmail, isLinkExpired, LINK_VALIDITY_HOURS } from '@/lib/utils/crypto';

// Loading component to display while the main component is loading
function ExportLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
      <p className="text-xl">Loading...</p>
    </div>
  );
}

// Main export page content
function ExportPageContent() {
  const searchParams = useSearchParams();
  const { ready } = usePrivyAuth();
  const { sendCode, loginWithCode } = useLoginWithEmail();
  const { exportWallet } = useSolanaWallets();
  
  const [verificationStep, setVerificationStep] = useState<'initial' | 'sentCode' | 'verified'>('initial');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const id = searchParams.get('id');
  const email = id ? decryptEmail(id) : '';
  
  // Check if the email is valid and link hasn't expired
  const validEmail = isValidEmail(email);
  const linkExpired = id ? isLinkExpired(id) : true;
  
  useEffect(() => {
    // Only perform redirect after Privy is ready and if:
    // - id is absent, or
    // - email is invalid, or
    // - link has expired
    if (ready && (!id || !validEmail || linkExpired)) {
      window.location.href = 'https://wagus-app.com';
    }
  }, [id, ready, validEmail, linkExpired]);
  
  // If there's no id or invalid email or link expired, we'll redirect in the useEffect
  // Show a different message if the link has expired
  if (!id || !validEmail || linkExpired) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
        {linkExpired && id ? (
          <div className="text-center">
            <p className="text-xl mb-4">This link has expired.</p>
            <p className="text-zinc-400">Export links are valid for {LINK_VALIDITY_HOURS} hours.</p>
            <p className="text-zinc-400 mt-2">Redirecting to Wagus App...</p>
          </div>
        ) : (
          <p className="text-xl">Redirecting to Wagus App...</p>
        )}
      </div>
    );
  }
  
  const handleSendCode = async () => {
    try {
      setIsLoading(true);
      setError('');
      await sendCode({ email });
      setVerificationStep('sentCode');
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
      setVerificationStep('verified');
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
    switch (verificationStep) {
      case 'initial':
        return (
          <div className="bg-zinc-900 p-6 rounded-lg w-full max-w-md border border-zinc-800">
            <h2 className="text-2xl font-semibold mb-4">Verify Your Email</h2>              <p className="text-zinc-300 mb-6">
              To export your secret key, we need to verify your email address: <strong>{email}</strong>
            </p>
            
            <button
              className="w-full py-3 px-6 bg-white hover:bg-zinc-200 transition-colors text-black font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSendCode}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </button>
            
            {error && <p className="text-zinc-400 mt-4">{error}</p>}
          </div>
        );
        
      case 'sentCode':
        return (
          <div className="bg-zinc-900 p-6 rounded-lg w-full max-w-md border border-zinc-800">
            <h2 className="text-2xl font-semibold mb-4">Enter Verification Code</h2>
            <p className="text-zinc-300 mb-6">
              We&apos;ve sent a verification code to <strong>{email}</strong>. Please check your inbox and enter the code below.
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
                onClick={() => setVerificationStep('initial')}
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
            
            {error && <p className="text-zinc-400 mt-4">{error}</p>}
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
              className="w-full py-3 px-6 bg-white hover:bg-zinc-200 transition-colors text-black font-medium rounded-md"
              onClick={handleExportSecretKey}
            >
              Export Secret Key
            </button>
            
            <p className="text-zinc-400 text-sm mt-4">
              Note: Your secret key gives full access to your wallet. Never share it with anyone.
            </p>
            
            {error && <p className="text-zinc-400 mt-4">{error}</p>}
          </div>
        );
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
      <main className="flex flex-col gap-8 items-center text-center max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-white mb-6">
          Secure Access
        </h1>
        
        {renderContent()}
      </main>
      
      <footer className="absolute bottom-8 text-zinc-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Wagus. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Default export that wraps the main content in a Suspense boundary
export default function ExportPage() {
  return (
    <Suspense fallback={<ExportLoading />}>
      <ExportPageContent />
    </Suspense>
  );
}
