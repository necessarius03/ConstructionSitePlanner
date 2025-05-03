import { Shape } from '../features/site-layout/types';
import { equipmentData, getEquipmentById } from '../data/equipment-data';

export interface SiteLayout {
  id: string;
  name: string;
  description?: string;
  shapes: Shape[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'site_layouts';

const prepareShapesForStorage = (shapes: Shape[]): any[] => {
  return shapes.map(shape => {
    if (shape.type === 'equipment' && shape.equipmentId) {
      const { iconComponent, ...shapeWithoutIcon } = shape;
      return shapeWithoutIcon;
    }
    return shape;
  });
};

const prepareShapesFromStorage = (shapes: any[]): Shape[] => {
  return shapes.map(shape => {
    // Nếu là thiết bị, khôi phục iconComponent từ equipmentId
    if (shape.type === 'equipment' && shape.equipmentId) {
      const equipment = getEquipmentById(shape.equipmentId);
      if (equipment) {
        return {
          ...shape,
          iconComponent: equipment.icon
        };
      }
    }
    return shape;
  });
};

const getLayouts = (): SiteLayout[] => {
  const layouts = localStorage.getItem(STORAGE_KEY);
  const parsedLayouts = layouts ? JSON.parse(layouts) : [];
  
  return parsedLayouts.map((layout: any) => ({
    ...layout,
    shapes: prepareShapesFromStorage(layout.shapes || [])
  }));
};

const saveLayouts = (layouts: SiteLayout[]) => {
  const preparedLayouts = layouts.map(layout => ({
    ...layout,
    shapes: prepareShapesForStorage(layout.shapes)
  }));
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preparedLayouts));
};

export const SiteLayoutService = {
  getAllLayouts: (): SiteLayout[] => {
    return getLayouts();
  },

  getLayoutById: (id: string): SiteLayout | null => {
    const layouts = getLayouts();
    return layouts.find(layout => layout.id === id) || null;
  },

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