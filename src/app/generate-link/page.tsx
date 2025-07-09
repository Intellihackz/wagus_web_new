'use client';

import { useState } from 'react';
import { encryptEmail, isValidEmail, LINK_VALIDITY_HOURS } from '@/lib/utils/crypto';

export default function EmailLinkGenerator() {
  const [email, setEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [error, setError] = useState('');
  const [generatedTime, setGeneratedTime] = useState<Date | null>(null);
  
  const handleGenerate = () => {
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      setGeneratedLink('');
      setGeneratedTime(null);
      return;
    }
    
    setError('');
    const encryptedEmail = encryptEmail(email);
    const link = `${window.location.origin}/export?id=${encryptedEmail}`;
    setGeneratedLink(link);
    setGeneratedTime(new Date());
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
      <main className="flex flex-col gap-8 items-center max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-white mb-6">
          Email Link Generator
        </h1>
        
        <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter email address"
            />
            {error && <p className="text-gray-400 mt-2 text-sm">{error}</p>}
          </div>
          
          <button
            className="w-full py-3 px-6 bg-white hover:bg-gray-200 transition-colors text-black font-medium rounded-md"
            onClick={handleGenerate}
          >
            Generate Link
          </button>
          
          {generatedLink && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Generated Link
              </label>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="flex-grow px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-md text-white focus:outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-3 bg-gray-700 border border-gray-700 rounded-r-md text-white hover:bg-gray-600 transition-colors"
                >
                  Copy
                </button>
              </div>
              {generatedTime && (
                <div className="mt-4 p-3 bg-gray-800/50 border border-gray-700 rounded-md">
                  <p className="text-gray-200 text-sm font-medium">Link Details:</p>
                  <p className="text-gray-300 text-sm mt-1">
                    • Generated: {generatedTime.toLocaleString()}
                  </p>
                  <p className="text-gray-300 text-sm">
                    • Expires: {new Date(generatedTime.getTime() + LINK_VALIDITY_HOURS * 60 * 60 * 1000).toLocaleString()}
                  </p>
                  <p className="text-gray-300 text-sm">
                    • Valid for: {LINK_VALIDITY_HOURS} hours
                  </p>
                </div>
              )}
              <p className="text-gray-400 text-sm mt-4">
                Use this link to access the export page with the encrypted email.
                Remember that the link will expire after {LINK_VALIDITY_HOURS} hours.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="absolute bottom-8 text-white/50 text-sm">
        <p>For development and testing purposes only.</p>
      </footer>
    </div>
  );
}
