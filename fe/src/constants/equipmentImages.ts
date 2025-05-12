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

/**
 * Lấy URL hình ảnh từ key
 * @param key Key của hình ảnh hoặc tên thiết bị
 * @returns URL hình ảnh
 */
export const getImageUrl = (key?: string): string => {
  if (!key) return EQUIPMENT_IMAGES.DEFAULT;
  
  // Kiểm tra nếu key trực tiếp khớp với một key trong EQUIPMENT_IMAGES
  if (key in EQUIPMENT_IMAGES) {
    return EQUIPMENT_IMAGES[key as keyof typeof EQUIPMENT_IMAGES];
  }
  
  // Kiểm tra nếu key có trong special mappings
  const lowerKey = key.toLowerCase();
  
  // Xử lý trường hợp key là một key của EQUIPMENT_IMAGES nhưng khác về chữ hoa/thường
  for (const equipmentKey of Object.keys(EQUIPMENT_IMAGES)) {
    if (equipmentKey.toLowerCase() === lowerKey) {
      return EQUIPMENT_IMAGES[equipmentKey as keyof typeof EQUIPMENT_IMAGES];
    }
  }
  
  // Mặc định trả về hình ảnh DEFAULT
  console.warn(`No image found for key: ${key}, using default image`);
  return EQUIPMENT_IMAGES.DEFAULT;
};