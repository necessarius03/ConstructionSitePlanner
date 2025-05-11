// src/constants/equipmentImages.ts
export const EQUIPMENT_IMAGES = {
  // Hình ảnh thiết bị từ flaticon.com
  BULLDOZER: 'https://cdn-icons-png.flaticon.com/512/5528/5528226.png',
  DUMP_TRUCK: 'https://cdn-icons-png.flaticon.com/512/2222/2222913.png',
  EXCAVATOR: 'https://cdn-icons-png.flaticon.com/512/3014/3014275.png',
  TOWER_CRANE: 'https://cdn-icons-png.flaticon.com/512/1037/1037812.png',
  MOBILE_CRANE: 'https://cdn-icons-png.flaticon.com/512/7425/7425221.png',
  CONCRETE_MIXER: 'https://cdn-icons-png.flaticon.com/512/2760/2760570.png',
  CEMENT_PUMP: 'https://cdn-icons-png.flaticon.com/512/826/826023.png',
  GENERATOR: 'https://cdn-icons-png.flaticon.com/512/6834/6834424.png',
  FORKLIFT: 'https://cdn-icons-png.flaticon.com/512/2503/2503507.png',
  COMPACTOR: 'https://cdn-icons-png.flaticon.com/512/3127/3127224.png',
  
  // Hình ảnh mặc định
  DEFAULT: 'https://cdn-icons-png.flaticon.com/512/4947/4947484.png'
};

// Mapping từ iconName sang URL hình ảnh
export const iconToImageMapping: Record<string, string> = {
  'BuildOutlined': EQUIPMENT_IMAGES.BULLDOZER,
  'RocketOutlined': EQUIPMENT_IMAGES.GENERATOR,
  'CarOutlined': EQUIPMENT_IMAGES.DUMP_TRUCK,
  'ToolOutlined': EQUIPMENT_IMAGES.COMPACTOR,
  'LoadingOutlined': EQUIPMENT_IMAGES.CONCRETE_MIXER,
  'ApartmentOutlined': EQUIPMENT_IMAGES.TOWER_CRANE,
  'DeploymentUnitOutlined': EQUIPMENT_IMAGES.MOBILE_CRANE,
  'ControlOutlined': EQUIPMENT_IMAGES.CEMENT_PUMP,
  'RobotOutlined': EQUIPMENT_IMAGES.EXCAVATOR,
  'ForkOutlined': EQUIPMENT_IMAGES.FORKLIFT
};

// Helper function để lấy URL hình ảnh từ iconName
export const getImageUrl = (iconName: string): string => {
  return iconToImageMapping[iconName] || EQUIPMENT_IMAGES.DEFAULT;
};