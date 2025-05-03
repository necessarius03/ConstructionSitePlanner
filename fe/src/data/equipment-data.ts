import { 
  BuildOutlined, 
  RocketOutlined, 
  CarOutlined, 
  ToolOutlined,
  LoadingOutlined,
  ApartmentOutlined,
  DeploymentUnitOutlined,
  ControlOutlined,
  RobotOutlined,
  ForkOutlined
} from '@ant-design/icons';

export interface Equipment {
  id: string;
  name: string;
  icon: React.ComponentType;
  width: number;
  height: number;
  description: string;
  category: 'heavy' | 'transport' | 'lifting' | 'concrete' | 'other';
  color: string;
}

export const equipmentData: Equipment[] = [
  {
    id: 'tower-crane',
    name: 'Cần cẩu tháp',
    icon: ApartmentOutlined,
    width: 80,
    height: 80,
    description: 'Thiết bị nâng hạ vật liệu và các cấu kiện với tầm với cao',
    category: 'lifting',
    color: '#ff9800'
  },
  {
    id: 'excavator',
    name: 'Máy xúc',
    icon: RobotOutlined,
    width: 60,
    height: 40,
    description: 'Thiết bị đào đất và vận chuyển vật liệu',
    category: 'heavy',
    color: '#ffc107'
  },
  {
    id: 'bulldozer',
    name: 'Máy ủi',
    icon: BuildOutlined,
    width: 70,
    height: 45,
    description: 'Thiết bị san ủi và di chuyển đất, cát',
    category: 'heavy',
    color: '#ff5722'
  },
  {
    id: 'concrete-mixer',
    name: 'Máy trộn bê tông',
    icon: LoadingOutlined,
    width: 50,
    height: 50,
    description: 'Thiết bị trộn xi măng, cốt liệu và nước thành bê tông',
    category: 'concrete',
    color: '#8bc34a'
  },
  {
    id: 'mobile-crane',
    name: 'Cần cẩu di động',
    icon: DeploymentUnitOutlined,
    width: 75,
    height: 50,
    description: 'Thiết bị nâng hạ có thể di chuyển linh hoạt',
    category: 'lifting',
    color: '#ff5252'
  },
  {
    id: 'dump-truck',
    name: 'Xe tải ben',
    icon: CarOutlined,
    width: 65,
    height: 40,
    description: 'Phương tiện vận chuyển vật liệu rời',
    category: 'transport',
    color: '#3f51b5'
  },
  {
    id: 'forklift',
    name: 'Xe nâng',
    icon: ForkOutlined,
    width: 45,
    height: 35,
    description: 'Thiết bị nâng và di chuyển pallet vật liệu',
    category: 'transport',
    color: '#009688'
  },
  {
    id: 'cement-pump',
    name: 'Máy bơm bê tông',
    icon: ControlOutlined,
    width: 60,
    height: 40,
    description: 'Thiết bị bơm bê tông lên cao hoặc xa',
    category: 'concrete',
    color: '#4caf50'
  },
  {
    id: 'generator',
    name: 'Máy phát điện',
    icon: RocketOutlined,
    width: 40,
    height: 30,
    description: 'Thiết bị cung cấp điện cho công trường',
    category: 'other',
    color: '#607d8b'
  },
  {
    id: 'compactor',
    name: 'Máy đầm',
    icon: ToolOutlined,
    width: 45,
    height: 35,
    description: 'Thiết bị đầm nén đất, cát hoặc bê tông',
    category: 'other', 
    color: '#795548'
  }
];

export const getEquipmentById = (id: string): Equipment | undefined => {
  return equipmentData.find(equipment => equipment.id === id);
};

export const getEquipmentsByCategory = (category: Equipment['category']): Equipment[] => {
  return equipmentData.filter(equipment => equipment.category === category);
};