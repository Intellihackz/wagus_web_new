import { 
  collection, 
  doc, 
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  limit,
  where,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  DocumentData 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Project {
  id?: string;
  name: string;
  description: string;
  spendingPlan: string;
  launchDate: string;
  likesCount: number;
  fundingProgress: number;
  totalFunded: number;
  max_allocation: number;
  walletAddress: string;
  contactEmail: string;
  preferred_token_address: string;
  preferred_token_ticker: string;
  addressesFunded: string[];
  investors: number; // Number of investors
  like: string[]; // Array of wallet addresses who liked the project
  
  // Links
  websiteLink: string;
  socialsLink: string;
  telegramLink: string;
  gitHubLink: string;
  whitePaperLink: string;
  roadmapLink: string;
  
  timestamp?: any;
}

export const projectService = {  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    try {
      const q = query(
        collection(db, 'projects'),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  },

  // Get project by ID
  async getProjectById(projectId: string): Promise<Project | null> {
    try {
      const docRef = doc(db, 'Projects', projectId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Project;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting project:', error);
      throw error;
    }
  },
  // Fund a project
  async fundProject(projectId: string, userWallet: string, amount: number): Promise<void> {
    try {
      const projectRef = doc(db, 'Projects', projectId);
      const project = await this.getProjectById(projectId);
      
      if (!project) {
        throw new Error('Project not found');
      }

      // Check if user already funded
      if (project.addressesFunded.includes(userWallet)) {
        throw new Error('You have already funded this project');
      }

      // Check max allocation
      if (project.totalFunded + amount > project.max_allocation) {
        throw new Error('Funding would exceed maximum allocation');
      }

      // Update project with new funding
      await updateDoc(projectRef, {
        totalFunded: project.totalFunded + amount,
        fundingProgress: (project.totalFunded + amount) / project.max_allocation,
        addressesFunded: arrayUnion(userWallet),
        investors: (project.investors || 0) + 1 // Increment investor count
      });

    } catch (error) {
      console.error('Error funding project:', error);
      throw error;
    }
  },
  // Like/Unlike a project
  async toggleProjectLike(projectId: string, userWallet: string): Promise<void> {
    try {
      const projectRef = doc(db, 'Projects', projectId);
      const project = await this.getProjectById(projectId);
      
      if (!project) {
        throw new Error('Project not found');
      }

      const currentLikes = project.like || [];
      const hasLiked = currentLikes.includes(userWallet);
      
      if (hasLiked) {
        // Unlike: remove user from like array and decrement count
        await updateDoc(projectRef, {
          like: arrayRemove(userWallet),
          likesCount: Math.max(0, project.likesCount - 1)
        });
      } else {
        // Like: add user to like array and increment count
        await updateDoc(projectRef, {
          like: arrayUnion(userWallet),
          likesCount: project.likesCount + 1
        });
      }

    } catch (error) {
      console.error('Error toggling project like:', error);
      throw error;
    }
  },

  // Get projects by funding status
  async getProjectsByFundingStatus(fundedOnly: boolean = false): Promise<Project[]> {
    try {
      let q;
      if (fundedOnly) {
        q = query(
          collection(db, 'Projects'),
          where('fundingProgress', '>=', 1),
          orderBy('fundingProgress', 'desc')
        );
      } else {
        q = query(
          collection(db, 'Projects'),
          where('fundingProgress', '<', 1),
          orderBy('timestamp', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
    } catch (error) {
      console.error('Error getting projects by funding status:', error);
      throw error;
    }
  },
  // Check if user has funded a project
  hasUserFunded(project: Project, userWallet: string): boolean {
    return project.addressesFunded.includes(userWallet);
  },

  // Check if user has liked a project
  hasUserLiked(project: Project, userWallet: string): boolean {
    return project.like ? project.like.includes(userWallet) : false;
  },

  // Get funding statistics
  async getFundingStats(): Promise<{ totalProjects: number; totalFunded: number; activeProjects: number }> {
    try {
      const projects = await this.getAllProjects();
      
      return {
        totalProjects: projects.length,
        totalFunded: projects.reduce((sum, project) => sum + project.totalFunded, 0),
        activeProjects: projects.filter(project => project.fundingProgress < 1).length
      };
    } catch (error) {
      console.error('Error getting funding stats:', error);
      throw error;
    }
  }
};
