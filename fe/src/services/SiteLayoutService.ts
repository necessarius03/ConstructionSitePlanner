// src/services/SiteLayoutService.ts
import { Shape } from '../pages/site-layout/types';

export interface SiteLayout {
  id: string;
  name: string;
  description?: string;
  shapes: Shape[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'site_layouts';

// Helper để lấy layout từ local storage
const getLayouts = (): SiteLayout[] => {
  const layouts = localStorage.getItem(STORAGE_KEY);
  return layouts ? JSON.parse(layouts) : [];
};

// Helper để lưu layout vào local storage
const saveLayouts = (layouts: SiteLayout[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
};

export const SiteLayoutService = {
  // Lấy tất cả layout
  getAllLayouts: (): SiteLayout[] => {
    return getLayouts();
  },

  // Lấy layout theo ID
  getLayoutById: (id: string): SiteLayout | null => {
    const layouts = getLayouts();
    return layouts.find(layout => layout.id === id) || null;
  },

  // Tạo layout mới
  createLayout: (name: string, description: string = '', shapes: Shape[] = []): SiteLayout => {
    const layouts = getLayouts();
    const now = new Date().toISOString();
    
    const newLayout: SiteLayout = {
      id: Date.now().toString(),
      name,
      description,
      shapes,
      createdAt: now,
      updatedAt: now
    };
    
    layouts.push(newLayout);
    saveLayouts(layouts);
    
    return newLayout;
  },

  // Cập nhật layout
  updateLayout: (id: string, updates: Partial<SiteLayout>): SiteLayout | null => {
    const layouts = getLayouts();
    const index = layouts.findIndex(layout => layout.id === id);
    
    if (index === -1) return null;
    
    const updatedLayout = {
      ...layouts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    layouts[index] = updatedLayout;
    saveLayouts(layouts);
    
    return updatedLayout;
  },

  // Xóa layout
  deleteLayout: (id: string): boolean => {
    const layouts = getLayouts();
    const filteredLayouts = layouts.filter(layout => layout.id !== id);
    
    if (filteredLayouts.length === layouts.length) {
      return false; // Không có thay đổi
    }
    
    saveLayouts(filteredLayouts);
    return true;
  }
};

export default SiteLayoutService;