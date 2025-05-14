export const EQUIPMENT_IMAGES = {
  BULLDOZER: 'https://cdn-icons-png.flaticon.com/512/2204/2204128.png',
  DUMP_TRUCK: 'https://cdn-icons-png.flaticon.com/512/14177/14177948.png',
  EXCAVATOR: 'https://cdn-icons-png.flaticon.com/512/671/671573.png',
  TOWER_CRANE: 'https://cdn-icons-png.flaticon.com/512/8125/8125022.png',
  MOBILE_CRANE: 'https://cdn-icons-png.flaticon.com/512/8089/8089372.png',
  CONCRETE_MIXER: 'https://cdn-icons-png.flaticon.com/512/2760/2760570.png',
  CEMENT_PUMP: 'https://cdn-icons-png.flaticon.com/512/4693/4693937.png',
  GENERATOR: 'https://cdn-icons-png.flaticon.com/512/4324/4324756.png',
  FORKLIFT: 'https://cdn-icons-png.flaticon.com/512/10614/10614604.png',
  COMPACTOR: 'https://cdn-icons-png.flaticon.com/512/8819/8819008.png',
  
  SCAFFOLD: 'https://cdn-icons-png.flaticon.com/512/4955/4955667.png',
  HAMMER_DRILL: 'https://cdn-icons-png.flaticon.com/512/2276/2276387.png',
  ROAD_ROLLER: 'https://cdn-icons-png.flaticon.com/512/4931/4931280.png',
  CRANE_HOOK: 'https://cdn-icons-png.flaticon.com/512/2276/2276253.png',
  CEMENT_TRUCK: 'https://cdn-icons-png.flaticon.com/512/9614/9614269.png',
  LADDER: 'https://cdn-icons-png.flaticon.com/512/17418/17418208.png',
  SHOVEL: 'https://cdn-icons-png.flaticon.com/512/2979/2979695.png',
  CONTAINER: 'https://cdn-icons-png.flaticon.com/512/3211/3211599.png',
  TOOLBOX: 'https://cdn-icons-png.flaticon.com/512/8818/8818996.png',
  WELDING: 'https://cdn-icons-png.flaticon.com/512/7140/7140907.png',
  
  // Previous additions
  CART: 'https://cdn-icons-png.flaticon.com/512/1606/1606208.png', // Construction cart/trolley
  CONCRETE_BLOCK: 'https://cdn-icons-png.flaticon.com/512/2276/2276321.png', // Concrete block
  TEMPORARY_HOUSING: 'https://cdn-icons-png.flaticon.com/512/8581/8581398.png', // Temporary shelter/housing
  
  // New additions
  WHEELBARROW: 'https://cdn-icons-png.flaticon.com/512/10279/10279804.png', // Wheelbarrow for transporting materials
  JACKHAMMER: 'https://cdn-icons-png.flaticon.com/512/17944/17944004.png', // Jackhammer for breaking concrete
  SAFETY_HELMET: 'https://cdn-icons-png.flaticon.com/512/11498/11498264.png', // Safety helmet for worker protection
  BRICKS: 'https://cdn-icons-png.flaticon.com/512/9669/9669391.png', // Stack of bricks for masonry
  STEEL_BEAM: 'https://cdn-icons-png.flaticon.com/512/6027/6027040.png', // Steel beam for structural work
  PAINT_ROLLER: 'https://cdn-icons-png.flaticon.com/512/1814/1814428.png', // Paint roller for finishing work
  TROWEL: 'https://cdn-icons-png.flaticon.com/512/2564/2564288.png', // Trowel for masonry or plastering
  MEASURING_TAPE: 'https://cdn-icons-png.flaticon.com/512/5902/5902682.png', // Measuring tape for site measurements
  SAFETY_VEST: 'https://cdn-icons-png.flaticon.com/512/9272/9272199.png', // Safety vest for worker visibility
  PILE_DRIVER: 'https://cdn-icons-png.flaticon.com/512/14779/14779636.png', // Pile driver for foundation work
  BARRIC_ADE: 'https://cdn-icons-png.flaticon.com/512/4968/4968073.png', // Barricade for site safety
  WATER_PUMP: 'https://cdn-icons-png.flaticon.com/512/951/951049.png', // Water pump for dewatering
  
  DEFAULT: 'https://cdn-icons-png.flaticon.com/512/4947/4947484.png'
};

export const getImageUrl = (key?: string): string => {
  if (!key) return EQUIPMENT_IMAGES.DEFAULT;
  
  if (key in EQUIPMENT_IMAGES) {
    return EQUIPMENT_IMAGES[key as keyof typeof EQUIPMENT_IMAGES];
  }
  
  const lowerKey = key.toLowerCase();
  
  for (const equipmentKey of Object.keys(EQUIPMENT_IMAGES)) {
    if (equipmentKey.toLowerCase() === lowerKey) {
      return EQUIPMENT_IMAGES[equipmentKey as keyof typeof EQUIPMENT_IMAGES];
    }
  }
  
  return EQUIPMENT_IMAGES.DEFAULT;
};