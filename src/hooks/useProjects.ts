import { useState, useEffect, useCallback } from 'react';
import { projectService, Project } from '@/services/projectService';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load all projects
  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const projectsData = await projectService.getAllProjects();
      setProjects(projectsData);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    loading,
    error,
    refetch: loadProjects
  };
}

export function useProjectActions() {
  const [funding, setFunding] = useState(false);
  const [liking, setLiking] = useState(false);

  const fundProject = useCallback(async (projectId: string, userWallet: string, amount: number) => {
    setFunding(true);
    try {
      await projectService.fundProject(projectId, userWallet, amount);
      return { success: true };
    } catch (error) {
      console.error('Error funding project:', error);
      return { success: false, error: error as Error };
    } finally {
      setFunding(false);
    }
  }, []);

  const toggleLike = useCallback(async (projectId: string, userWallet: string) => {
    setLiking(true);
    try {
      await projectService.toggleProjectLike(projectId, userWallet);
      return { success: true };
    } catch (error) {
      console.error('Error toggling like:', error);
      return { success: false, error: error as Error };
    } finally {
      setLiking(false);
    }
  }, []);

  return {
    fundProject,
    toggleLike,
    funding,
    liking
  };
}
