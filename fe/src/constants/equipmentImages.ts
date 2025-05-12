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
  
  // Thêm một số hình ảnh thiết bị xây dựng khác
  SCAFFOLD: 'https://cdn-icons-png.flaticon.com/512/5316/5316060.png',
  HAMMER_DRILL: 'https://cdn-icons-png.flaticon.com/512/921/921793.png',
  ROAD_ROLLER: 'https://cdn-icons-png.flaticon.com/512/8888/8888574.png',
  CRANE_HOOK: 'https://cdn-icons-png.flaticon.com/512/2826/2826187.png',
  CEMENT_TRUCK: 'https://cdn-icons-png.flaticon.com/512/7641/7641882.png',
  LADDER: 'https://cdn-icons-png.flaticon.com/512/5064/5064024.png',
  SHOVEL: 'https://cdn-icons-png.flaticon.com/512/4407/4407016.png',
  CONTAINER: 'https://cdn-icons-png.flaticon.com/512/831/831658.png',
  TOOLBOX: 'https://cdn-icons-png.flaticon.com/512/4207/4207783.png',
  WELDING: 'https://cdn-icons-png.flaticon.com/512/4941/4941453.png',
  
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
  'ForkOutlined': EQUIPMENT_IMAGES.FORKLIFT,
  'SlackOutlined': EQUIPMENT_IMAGES.SCAFFOLD,
  'FormatPainterOutlined': EQUIPMENT_IMAGES.HAMMER_DRILL,
  'CompassOutlined': EQUIPMENT_IMAGES.ROAD_ROLLER,
  'EnvironmentOutlined': EQUIPMENT_IMAGES.CRANE_HOOK,
  'BoxPlotOutlined': EQUIPMENT_IMAGES.CEMENT_TRUCK,
  'ColumnWidthOutlined': EQUIPMENT_IMAGES.LADDER,
  'BulbOutlined': EQUIPMENT_IMAGES.SHOVEL,
  'SwitcherOutlined': EQUIPMENT_IMAGES.CONTAINER,
  'GroupOutlined': EQUIPMENT_IMAGES.TOOLBOX,
  'FlagOutlined': EQUIPMENT_IMAGES.WELDING
};

// Reverse mapping - từ URL hình ảnh sang iconName
export const imageToIconMapping: Record<string, string> = 
  Object.entries(iconToImageMapping).reduce((acc, [iconName, imageUrl]) => {
    acc[imageUrl] = iconName;
    return acc;
  }, {} as Record<string, string>);

// Helper function để lấy URL hình ảnh từ iconName
export const getImageUrl = (iconName: string): string => {
  return iconToImageMapping[iconName] || EQUIPMENT_IMAGES.DEFAULT;
};

// Helper function để lấy iconName từ URL hình ảnh
export const getIconName = (imageUrl: string): string => {
  return imageToIconMapping[imageUrl] || 'BuildOutlined';
};