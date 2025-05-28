"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function AppPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  
  // Now it's safe to use Privy hooks since we have the ready wrapper
  const { logout, authenticated, user } = usePrivy();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authenticated) {
      router.push("/");
    }
  }, [authenticated, router]);

  // Show loading while checking authentication
  if (!authenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <div className="flex-1 ml-16 transition-all duration-300 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-gray-800 p-6">
          <div className="flex items-center justify-between">
            {/* Floating Chips */}
            <div className="flex items-center space-x-4 overflow-x-auto">
              <div className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-sm text-sm text-gray-300 cursor-pointer transition-colors whitespace-nowrap">
                #General
              </div>
              <div className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-sm text-sm text-gray-300 cursor-pointer transition-colors whitespace-nowrap">
                #NFTs
              </div>
              <div className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-sm text-sm text-gray-300 cursor-pointer transition-colors whitespace-nowrap">
                #Gaming
              </div>
              <div className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-sm text-sm text-gray-300 cursor-pointer transition-colors whitespace-nowrap">
                #AI Tools
              </div>
              <div className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-sm text-sm text-gray-300 cursor-pointer transition-colors whitespace-nowrap">
                #Trading
              </div>
              <div className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-sm text-sm text-gray-300 cursor-pointer transition-colors whitespace-nowrap">
                #Development
              </div>
              <div className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-sm text-sm text-gray-300 cursor-pointer transition-colors whitespace-nowrap">
                #Announcements
              </div>
            </div>            {/* Stats */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-400">1,234 online</span>
              </div>              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-400">123 holders</span>
              </div>
            </div>
          </div>
        </div>
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-end">
          <div className="space-y-4">
            {/* Sample Messages */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-purple-400 font-medium">
                  [alice_crypto]
                </span>
                <span className="text-xs text-gray-500">2:30 PM</span>
              </div>
              <div className="flex items-start justify-between">
                <p className="text-gray-300 flex-1">
                  Hey everyone! Just minted my first NFT on Solana 🚀
                </p>
                <button className="text-gray-400 hover:text-red-500 transition-colors ml-3">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-blue-400 font-medium">[5Gk...7xR2]</span>
                <span className="text-xs text-gray-500">2:32 PM</span>
              </div>
              <div className="flex items-start justify-between">
                <p className="text-gray-300 flex-1">
                  Congrats! The Solana ecosystem is amazing for creators
                </p>
                <button className="text-gray-400 hover:text-red-500 transition-colors ml-3">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-green-400 font-medium">
                  [dev_charlie]
                </span>
                <span className="text-xs text-gray-500">2:35 PM</span>
              </div>
              <div className="flex items-start justify-between">
                <p className="text-gray-300 flex-1">
                  Anyone working on any cool Web3 projects? Would love to
                  collaborate!
                </p>
                <button className="text-gray-400 hover:text-red-500 transition-colors ml-3">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-orange-400 font-medium">
                  [9Ab...3Kz8]
                </span>
                <span className="text-xs text-gray-500">2:38 PM</span>
              </div>
              <div className="flex items-start justify-between">
                <p className="text-gray-300 flex-1">
                  Just discovered this platform, loving the community vibes! 💜
                </p>
                <button className="text-gray-400 hover:text-red-500 transition-colors ml-3">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-red-400 font-medium">[wagus_fan]</span>
                <span className="text-xs text-gray-500">2:40 PM</span>
              </div>
              <div className="flex items-start justify-between">
                <p className="text-gray-300 flex-1">
                  The future is definitely decentralized. Wagus is leading the
                  way!
                </p>
                <button className="text-gray-400 hover:text-red-500 transition-colors ml-3">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Chat Input - Fixed at bottom */}
        <div className="border-t border-gray-800 p-6 bg-black">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-300 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-300 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-10V4a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2V4z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium">
              Send
            </button>
          </div>          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span>Press Enter to send, Shift + Enter for new line</span>
            <span>
              Connected as {user?.email?.address ? `[${user.email.address.split('@')[0]}]` : '[user]'}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      {/* <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-purple-600 hover:bg-purple-700 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center z-40"
      >
        <img
          src="/logo.png"
          alt="Wagus Logo"
          className="w-10 h-10 object-contain"
        />
      </button> */}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-gray-900 bg-opacity-95 backdrop-blur-sm rounded-lg p-8 max-w-md w-full mx-4 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="text-center">
              <img
                src="/logo.png"
                alt="Wagus Logo"
                className="w-20 h-20 object-contain mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-white mb-2">Wagus</h2>
              <p className="text-gray-300 mb-6">We all gonna use Solana</p>
              
              <div className="space-y-3">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Connect Wallet
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors">
                  View Profile
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
