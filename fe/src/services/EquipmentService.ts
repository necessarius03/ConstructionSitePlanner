import axios from 'axios';

const API_URL = 'http://localhost:5051/api';

export interface Equipment {
  id: string;
  name: string;
  iconName: string;
  width: number;
  height: number;
  description: string;
  category: string;
  color: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEquipmentRequest {
  name: string;
  iconName: string;
  width: number;
  height: number;
  description: string;
  category: string;
  color: string;
  notes?: string;
}

export interface UpdateEquipmentRequest {
  name: string;
  iconName: string;
  width: number;
  height: number;
  description: string;
  category: string;
  color: string;
  notes?: string;
}

class EquipmentService {
  // Get all equipment
  async getAllEquipment(): Promise<Equipment[]> {
    try {
      const response = await axios.get<Equipment[]>(`${API_URL}/equipment`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all equipment:', error);
      throw error;
    }
  }

  // Get equipment by ID
  async getEquipmentById(id: string): Promise<Equipment> {
    try {
      const response = await axios.get<Equipment>(`${API_URL}/equipment/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching equipment with ID ${id}:`, error);
      throw error;
    }
  }

  // Create a new equipment
  async createEquipment(data: CreateEquipmentRequest): Promise<Equipment> {
    try {
      const response = await axios.post<Equipment>(`${API_URL}/equipment`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating equipment:', error);
      throw error;
    }
  }

  // Update an existing equipment
  async updateEquipment(id: string, data: UpdateEquipmentRequest): Promise<Equipment> {
    try {
      const response = await axios.put<Equipment>(`${API_URL}/equipment/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating equipment with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete an equipment
  async deleteEquipment(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/equipment/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting equipment with ID ${id}:`, error);
      throw error;
    }
  }
}

export default new EquipmentService();