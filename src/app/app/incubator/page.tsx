"use client";
import React, { useState } from 'react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  Heart,
  ExternalLink,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAccountTier } from '@/context/account-tier-context';

interface Project {
  id: string;
  title: string;
  description: string;
  likes: number;
  spendingPlan: string;
  links: string[];
  launchDate: string;
  funding: number;
  targetFunding: number;
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'SolanaSwap DEX',
    description: 'A decentralized exchange built on Solana with advanced trading features and low fees.',
    likes: 234,
    spendingPlan: 'Development (60%), Marketing (25%), Operations (15%)',
    links: ['https://solanaswap.com', 'https://twitter.com/solanaswap', 'https://telegram.me/solanaswap', 'https://github.com/solanaswap', 'https://docs.solanaswap.com/whitepaper', 'https://docs.solanaswap.com/tokenomics'],
    launchDate: '2025-08-15',
    funding: 45000,
    targetFunding: 100000
  },
  {
    id: '2',
    title: 'NFT Marketplace',
    description: 'A next-generation NFT marketplace with AI-powered discovery and cross-chain support.',
    likes: 456,
    spendingPlan: 'AI Development (50%), Platform Development (30%), Marketing (20%)',
    links: ['https://nftmarket.com', 'https://twitter.com/nftmarket', 'https://telegram.me/nftmarket', 'https://github.com/nftmarket', 'https://docs.nftmarket.com/whitepaper', 'https://docs.nftmarket.com/tokenomics'],
    launchDate: '2025-07-20',
    funding: 67000,
    targetFunding: 80000
  },
  {
    id: '3',
    title: 'GameFi Platform',
    description: 'Play-to-earn gaming platform with integrated DeFi mechanics and social features.',
    likes: 189,
    spendingPlan: 'Game Development (70%), Token Economics (20%), Community Building (10%)',
    links: ['https://gamefi.com', 'https://twitter.com/gamefi', 'https://telegram.me/gamefi', 'https://github.com/gamefi', 'https://docs.gamefi.com/whitepaper', 'https://docs.gamefi.com/tokenomics'],
    launchDate: '2025-09-10',
    funding: 23000,
    targetFunding: 150000
  }
];

export default function IncubatorPage() {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const { getThemeColors } = useAccountTier();
  const themeColors = getThemeColors();

  const handleBackProject = (projectId: string, amount: number) => {
    console.log(`Backing project ${projectId} with $${amount}`);
    // Handle backing logic here
  };

  const toggleCardExpansion = (projectId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  return (
    <AppLayout>
      <div className="bg-black text-white">
        {/* Header */}
        <div className="mb-8">
          <div>            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Lightbulb className={`w-8 h-8 ${themeColors.accent}`} />
              Incubator
            </h1>
            <p className="text-gray-400 text-lg">
              Discover and fund the next generation of Solana projects
            </p>
          </div>
        </div>{/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => {
            const isExpanded = expandedCards.has(project.id);
            const maxDescriptionLength = 80;
            const maxSpendingPlanLength = 60;
            
            return (
              <div 
                key={project.id} 
                className={`bg-gray-900 rounded-lg border border-gray-800 overflow-hidden ${themeColors.accentHover.replace('hover:text-', 'hover:border-')} transition-all duration-300 ${
                  isExpanded ? 'row-span-2' : ''
                }`}
                style={{ 
                  minHeight: isExpanded ? 'auto' : '550px',
                  height: isExpanded ? 'auto' : '550px'
                }}
              >
                {/* Project Content */}
                <div className="p-6 h-full flex flex-col">
                  {/* Project Title and Likes */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white truncate pr-2">{project.title}</h3>
                    <div className="flex items-center gap-1 text-red-500 flex-shrink-0">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-medium">{project.likes}</span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm">
                      {isExpanded ? project.description : truncateText(project.description, maxDescriptionLength)}
                    </p>
                  </div>
                  
                  {/* Spending Plan */}
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Spending Plan:</h4>
                    <p className="text-gray-400 text-sm">
                      {isExpanded ? project.spendingPlan : truncateText(project.spendingPlan, maxSpendingPlanLength)}
                    </p>
                  </div>                  {/* Links */}
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Links:</h4>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { label: 'Website', icon: ExternalLink },
                        { label: 'Twitter', icon: ExternalLink },
                        { label: 'Telegram', icon: ExternalLink },
                        { label: 'GitHub', icon: ExternalLink },
                        { label: 'Whitepaper', icon: ExternalLink },
                        { label: 'Tokenomics', icon: ExternalLink }
                      ].map((linkType, index) => (
                        <a
                          key={index}
                          href={project.links[index]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-1 ${themeColors.accent} ${themeColors.accentHover} text-xs bg-gray-800 px-1 py-1 rounded text-center justify-center`}
                        >
                          <linkType.icon className="w-2 h-2" />
                          <span className="truncate">{linkType.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                  
                  {/* Launch Date */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>Launch: {new Date(project.launchDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                    {/* See More / See Less Button */}
                  {(project.description.length > maxDescriptionLength || 
                    project.spendingPlan.length > maxSpendingPlanLength) && (
                    <button
                      onClick={() => toggleCardExpansion(project.id)}
                      className={`flex items-center gap-1 ${themeColors.accent} ${themeColors.accentHover} text-sm mb-4 self-start`}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          See Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          See More
                        </>
                      )}
                    </button>
                  )}
                  
                  {/* Spacer to push funding section to bottom */}
                  <div className="flex-grow"></div>
                  
                  {/* Funding Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">
                        ${project.funding.toLocaleString()} raised
                      </span>
                      <span className="text-gray-400">
                        {Math.round((project.funding / project.targetFunding) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">                      <div 
                        className={`${themeColors.primary} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${Math.min((project.funding / project.targetFunding) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                      Goal: ${project.targetFunding.toLocaleString()}
                    </div>
                  </div>
                  
                  {/* Backing Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 5, 10, 25].map((amount) => (
                      <Button
                        key={amount}
                        onClick={() => handleBackProject(project.id, amount)}
                        className={`${themeColors.primary} ${themeColors.primaryHover} text-white text-sm py-2 px-3`}
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
