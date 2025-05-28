"use client";
import React, { useState } from 'react';
import AppLayout from '@/components/app-layout';
import { usePrivy } from '@privy-io/react-auth';
import { User, Mail, Wallet, Settings, Shield, Edit3, Check, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProfilePage() {
  const { user, logout, authenticated } = usePrivy();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState(user?.email?.address?.split('@')[0] || 'User');
  const [tempUsername, setTempUsername] = useState(username);
  const [accountTier, setAccountTier] = useState<'basic' | 'adventurer'>('basic');

  const handleSaveUsername = () => {
    setUsername(tempUsername);
    setIsEditingUsername(false);
  };

  const handleCancelEdit = () => {
    setTempUsername(username);
    setIsEditingUsername(false);
  };

  if (!authenticated || !user) {
    return (
      <AppLayout>
        <div className="bg-black text-white">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
            <p className="text-gray-400">Please log in to view your profile.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-black text-white">        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <User className="w-8 h-8 text-blue-500" />
            Profile
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your account settings and information
          </p>
        </div>

        {/* User Avatar and Basic Info */}
        <div className="mb-8">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {username.charAt(0).toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center border-2 border-black transition-colors">
                <Camera className="w-3 h-3 text-gray-300" />
              </button>
            </div>

            {/* Username and Tier */}
            <div className="flex-1">
              {/* Username */}
              <div className="flex items-center gap-3 mb-2">
                {isEditingUsername ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white w-48"
                      autoFocus
                    />
                    <Button
                      onClick={handleSaveUsername}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 p-2"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      size="sm"
                      variant="outline"
                      className="border-gray-600 p-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">{username}</h2>
                    <Button
                      onClick={() => setIsEditingUsername(true)}
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-white p-2"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Account Tier */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Account Tier:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAccountTier('basic')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      accountTier === 'basic'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    Basic
                  </button>
                  <button
                    onClick={() => setAccountTier('adventurer')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      accountTier === 'adventurer'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    Adventurer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>{/* Profile Content */}
        <div className="space-y-8">
          {/* Account Information */}
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              Account Information
            </h2>
            
            <div className="space-y-6 ml-7">
              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Email Address</p>
                  <p className="text-white font-medium">
                    {user.email?.address || 'No email provided'}
                  </p>
                </div>
              </div>

              {/* User ID */}
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">User ID</p>
                  <p className="text-white font-medium font-mono text-sm">
                    {user.id}
                  </p>
                </div>
              </div>

              {/* Created At */}
              <div className="flex items-start gap-3">
                <Settings className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Account Created</p>
                  <p className="text-white font-medium">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Information */}
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-purple-500" />
              Wallet Information
            </h2>
            
            <div className="space-y-6 ml-7">
              {user.wallet ? (
                <>
                  <div className="flex items-start gap-3">
                    <Wallet className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Wallet Address</p>
                      <p className="text-white font-medium font-mono text-sm break-all">
                        {user.wallet.address}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Settings className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Wallet Type</p>
                      <p className="text-white font-medium capitalize">
                        {user.wallet.walletClientType || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-gray-400" />
                  <p className="text-gray-400">No wallet connected</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex gap-4">
            <Button
              onClick={logout}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
