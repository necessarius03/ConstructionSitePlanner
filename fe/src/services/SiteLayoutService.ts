import axios from 'axios';
import { Shape } from '../features/site-layout/types';

const API_URL = 'http://localhost:5051/api';

export interface SiteLayout {
  id: string;
  name: string;
  description?: string;
  shapes: Shape[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSiteLayoutRequest {
  name: string;
  description?: string;
  shapes: Shape[];
}

export interface UpdateSiteLayoutRequest {
  name: string;
  description?: string;
  shapes: Shape[];
}

class SiteLayoutService {
  // Get all layouts
  async getAllLayouts(): Promise<SiteLayout[]> {
    try {
      const response = await axios.get<SiteLayout[]>(`${API_URL}/site-layouts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all layouts:', error);
      throw error;
    }
  }

  // Get layout by ID
  async getLayoutById(id: string): Promise<SiteLayout> {
    try {
      const response = await axios.get<SiteLayout>(`${API_URL}/site-layouts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching layout with ID ${id}:`, error);
      throw error;
    }
  }

  // Create a new layout
  async createLayout(data: CreateSiteLayoutRequest): Promise<SiteLayout> {
    try {
      const response = await axios.post<SiteLayout>(`${API_URL}/site-layouts`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating layout:', error);
      throw error;
    }
  }

  // Update an existing layout
  async updateLayout(id: string, data: UpdateSiteLayoutRequest): Promise<SiteLayout> {
    try {
      const response = await axios.put<SiteLayout>(`${API_URL}/site-layouts/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating layout with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete a layout
  async deleteLayout(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/site-layouts/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting layout with ID ${id}:`, error);
      throw error;
    }
  }
}

export default new SiteLayoutService();