import axios from 'axios';

const API_URL = 'http://localhost:5051/api';

export interface Progress {
  id: string;
  name: string;
  description: string;
  siteLayoutId: string;
  zoneShapeId?: string;
  startDate: string;
  endDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  completionPercentage: number;
  status: ProgressStatus;
  color: string;
  responsiblePerson?: string;
  notes?: string;
  dependsOn?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'delayed';

export interface CreateProgressRequest {
  name: string;
  description: string;
  siteLayoutId: string;
  zoneShapeId?: string;
  startDate: string;
  endDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  completionPercentage: number;
  status: ProgressStatus;
  color: string;
  responsiblePerson?: string;
  notes?: string;
  dependsOn?: string[];
}

export interface UpdateProgressRequest {
  name: string;
  description: string;
  zoneShapeId?: string;
  startDate: string;
  endDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  completionPercentage: number;
  status: ProgressStatus;
  color: string;
  responsiblePerson?: string;
  notes?: string;
  dependsOn?: string[];
}

class ProgressService {
  async getAllProgress(): Promise<Progress[]> {
    try {
      const response = await axios.get<Progress[]>(`${API_URL}/progress`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all progress entries:', error);
      throw error;
    }
  }

  async getProgressById(id: string): Promise<Progress> {
    try {
      const response = await axios.get<Progress>(`${API_URL}/progress/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching progress with ID ${id}:`, error);
      throw error;
    }
  }

  async getProgressBySiteLayout(siteLayoutId: string): Promise<Progress[]> {
    try {
      const response = await axios.get<Progress[]>(`${API_URL}/progress/site-layout/${siteLayoutId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching progress for site layout ${siteLayoutId}:`, error);
      throw error;
    }
  }

  async createProgress(data: CreateProgressRequest): Promise<Progress> {
    try {
      const response = await axios.post<Progress>(`${API_URL}/progress`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating progress:', error);
      throw error;
    }
  }

  async updateProgress(id: string, data: UpdateProgressRequest): Promise<Progress> {
    try {
      const response = await axios.put<Progress>(`${API_URL}/progress/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating progress with ID ${id}:`, error);
      throw error;
    }
  }

  async deleteProgress(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/progress/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting progress with ID ${id}:`, error);
      throw error;
    }
  }

  async updateCompletionPercentage(id: string, percentage: number): Promise<Progress> {
    try {
      const response = await axios.patch<Progress>(`${API_URL}/progress/${id}/completion/${percentage}`);
      return response.data;
    } catch (error) {
      console.error(`Error updating completion percentage for progress with ID ${id}:`, error);
      throw error;
    }
  }

  async updateStatus(id: string, status: ProgressStatus): Promise<Progress> {
    try {
      const response = await axios.patch<Progress>(`${API_URL}/progress/${id}/status/${status}`);
      return response.data;
    } catch (error) {
      console.error(`Error updating status for progress with ID ${id}:`, error);
      throw error;
    }
  }
}

export default new ProgressService();