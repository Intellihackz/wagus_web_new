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
  ChevronUp,
  Loader2
} from 'lucide-react';
import { useAccountTier } from '@/context/account-tier-context';
import { useProjects, useProjectActions } from '@/hooks/useProjects';
import { useUserManagement } from '@/hooks/useUserManagement';
import { Project, projectService } from '@/services/projectService';

export default function IncubatorPage() {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const { getThemeColors } = useAccountTier();
  const themeColors = getThemeColors();
  
  // Firebase hooks
  const { projects, loading: projectsLoading, error, refetch } = useProjects();
  const { fundProject, toggleLike, funding, liking } = useProjectActions();
  const { userData } = useUserManagement();

  const handleBackProject = async (projectId: string, amount: number) => {
    if (!userData?.wallet) {
      alert('Please connect your wallet first');
      return;
    }

    const result = await fundProject(projectId, userData.wallet, amount);
    if (result.success) {
      alert(`Successfully backed project with $${amount}!`);
      refetch(); // Refresh projects data
    } else {
      alert(`Failed to back project: ${result.error?.message}`);
    }
  };

  const handleLikeProject = async (projectId: string) => {
    if (!userData?.wallet) {
      alert('Please connect your wallet first');
      return;
    }

    const result = await toggleLike(projectId, userData.wallet);
    if (result.success) {
      refetch(); // Refresh projects data
    } else {
      alert(`Failed to like project: ${result.error?.message}`);
    }
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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'TBD';
    }
  };

  const getProjectLinks = (project: Project) => {
    return [
      { label: 'Website', url: project.websiteLink, icon: ExternalLink },
      { label: 'Social', url: project.socialsLink, icon: ExternalLink },
      { label: 'Telegram', url: project.telegramLink, icon: ExternalLink },
      { label: 'GitHub', url: project.gitHubLink, icon: ExternalLink },
      { label: 'Whitepaper', url: project.whitePaperLink, icon: ExternalLink },
      { label: 'Roadmap', url: project.roadmapLink, icon: ExternalLink }
    ].filter(link => link.url && link.url.trim() !== '');
  };

  if (projectsLoading) {
    return (
      <AppLayout>
        <div className="bg-black text-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className={`w-12 h-12 ${themeColors.accent} animate-spin mx-auto mb-4`} />
            <p className="text-lg text-gray-400">Loading projects...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="bg-black text-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-red-400 mb-4">Error loading projects</p>
            <Button onClick={refetch} className={`${themeColors.primary} ${themeColors.primaryHover}`}>
              Try Again
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <div className="bg-black text-white">        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Lightbulb className={`w-8 h-8 ${themeColors.accent}`} />
              Incubator
            </h1>
            <p className="text-gray-400 text-lg">
              Discover and fund the next generation of Solana projects
            </p>
          </div>
        </div>{/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <Lightbulb className={`w-16 h-16 ${themeColors.accent} mx-auto mb-4 opacity-50`} />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Projects Yet</h3>
            <p className="text-gray-500">Check back soon for exciting new projects to fund!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
            const isExpanded = expandedCards.has(project.id!);
            const maxDescriptionLength = 80;            const maxSpendingPlanLength = 60;
            const projectLinks = getProjectLinks(project);
            const hasUserFunded = userData?.wallet ? project.addressesFunded.includes(userData.wallet) : false;
            const hasUserLiked = userData?.wallet ? projectService.hasUserLiked(project, userData.wallet) : false;
            
            return (              <div 
                key={project.id} 
                className={`bg-gray-900 rounded-lg border border-gray-800 overflow-hidden ${themeColors.accentHover.replace('hover:text-', 'hover:border-')} transition-all duration-300`}
              >
                {/* Project Content */}
                <div className="p-6 h-full flex flex-col">
                  {/* Project Title and Likes */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white truncate pr-2">{project.name}</h3>                    <button
                      onClick={() => handleLikeProject(project.id!)}
                      disabled={liking || !userData?.wallet}
                      className="flex items-center gap-1 text-red-500 flex-shrink-0 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      <Heart className={`w-5 h-5 ${hasUserLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{project.likesCount}</span>
                    </button>
                  </div>
                  
                  {/* User Funding Status */}
                  {hasUserFunded && (
                    <div className="mb-3">
                      <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded">
                        ✓ You've funded this project
                      </span>
                    </div>
                  )}
                  
                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {isExpanded ? project.description : truncateText(project.description, maxDescriptionLength)}
                    </p>
                  </div>
                  
                  {/* Spending Plan */}
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2 text-sm">Spending Plan:</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {isExpanded ? project.spendingPlan : truncateText(project.spendingPlan, maxSpendingPlanLength)}
                    </p>
                  </div>
                  
                  {/* Links */}
                  {projectLinks.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-white font-medium mb-2 text-sm">Links:</h4>
                      <div className="grid grid-cols-3 gap-1">
                        {projectLinks.slice(0, 6).map((linkType, index) => (
                          <a
                            key={index}
                            href={linkType.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-1 ${themeColors.accent} ${themeColors.accentHover} text-xs bg-gray-800 px-2 py-1 rounded text-center justify-center hover:bg-gray-700 transition-colors`}
                          >
                            <linkType.icon className="w-3 h-3" />
                            <span className="truncate text-xs">{linkType.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Launch Date & Token Info */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>Launch: {formatDate(project.launchDate)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <p>Token: {project.preferred_token_ticker}</p>
                    </div>
                  </div>
                  
                  {/* See More / See Less Button */}
                  {(project.description.length > maxDescriptionLength || 
                    project.spendingPlan.length > maxSpendingPlanLength) && (
                    <button
                      onClick={() => toggleCardExpansion(project.id!)}
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
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">
                        ${project.totalFunded.toFixed(2)} raised
                      </span>
                      <span className="text-gray-400">
                        {Math.round(project.fundingProgress * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className={`${themeColors.primary} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${Math.min(project.fundingProgress * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mt-1">
                      <span>Goal: ${project.max_allocation.toLocaleString()}</span>
                      <span>{project.investors || 0} investors</span>
                    </div>
                  </div>
                  
                  {/* Backing Buttons */}
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[1, 5, 10, 25].map((amount) => (
                      <Button
                        key={amount}
                        onClick={() => handleBackProject(project.id!, amount)}
                        disabled={funding || !userData?.wallet || hasUserFunded || project.fundingProgress >= 1}
                        className={`${themeColors.primary} ${themeColors.primaryHover} text-white text-sm py-2 px-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {funding ? <Loader2 className="w-4 h-4 animate-spin" /> : `$${amount}`}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Funding Status Messages */}
                  {project.fundingProgress >= 1 && (
                    <div className="text-center">
                      <span className="text-xs text-green-400">🎉 Fully Funded!</span>
                    </div>
                  )}
                  {hasUserFunded && project.fundingProgress < 1 && (
                    <div className="text-center">
                      <span className="text-xs text-blue-400">Thank you for your support!</span>
                    </div>
                  )}
                </div>
              </div>
            );            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
