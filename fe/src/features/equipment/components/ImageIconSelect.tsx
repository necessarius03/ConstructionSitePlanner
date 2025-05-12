// src/features/equipment/components/ImageIconSelect.tsx
import React, { useState, useEffect } from 'react';
import { Radio, Card, Row, Col, Typography, Modal, Input, Tabs } from 'antd';
import { SearchOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { EQUIPMENT_IMAGES, iconToImageMapping, imageToIconMapping, getImageUrl } from '../../../constants/equipmentImages';

const { Title } = Typography;
const { TabPane } = Tabs;

interface ImageIconSelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

interface ImageOption {
  key: string;
  url: string;
  name: string;
  iconName: string;
}

const ImageIconSelect: React.FC<ImageIconSelectProps> = ({ value, onChange }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>(value || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Định nghĩa các danh mục thiết bị
  const categories = [
    { key: 'all', name: 'Tất cả' },
    { key: 'vehicles', name: 'Phương tiện' },
    { key: 'cranes', name: 'Cần cẩu' },
    { key: 'concrete', name: 'Bê tông' },
    { key: 'tools', name: 'Công cụ' },
    { key: 'others', name: 'Khác' }
  ];

  // Phân loại các thiết bị
  const getCategoryForEquipment = (key: string): string => {
    const vehicleKeys = ['BULLDOZER', 'DUMP_TRUCK', 'EXCAVATOR', 'ROAD_ROLLER', 'FORKLIFT'];
    const craneKeys = ['TOWER_CRANE', 'MOBILE_CRANE', 'CRANE_HOOK'];
    const concreteKeys = ['CONCRETE_MIXER', 'CEMENT_PUMP', 'CEMENT_TRUCK'];
    const toolKeys = ['HAMMER_DRILL', 'SHOVEL', 'TOOLBOX', 'WELDING', 'LADDER'];
    
    if (vehicleKeys.includes(key)) return 'vehicles';
    if (craneKeys.includes(key)) return 'cranes';
    if (concreteKeys.includes(key)) return 'concrete';
    if (toolKeys.includes(key)) return 'tools';
    return 'others';
  };

  // Tạo danh sách hiển thị từ EQUIPMENT_IMAGES
  const imageOptions: ImageOption[] = Object.entries(EQUIPMENT_IMAGES).map(([key, url]) => {
    // Tìm iconName tương ứng
    let iconName = '';
    for (const [icon, imgUrl] of Object.entries(iconToImageMapping)) {
      if (imgUrl === url) {
        iconName = icon;
        break;
      }
    }
    
    return {
      key,
      url,
      name: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()), // Format key thành tên hiển thị
      iconName
    };
  });

  // Lọc danh sách theo từ khóa tìm kiếm và danh mục
  const filteredOptions = imageOptions
    .filter(option => option.name.toLowerCase().includes(searchText.toLowerCase()))
    .filter(option => categoryFilter === 'all' || getCategoryForEquipment(option.key) === categoryFilter);

  // Xử lý khi chọn một hình ảnh
  const handleSelectImage = (option: ImageOption) => {
    setSelectedIcon(option.key);
    
    if (onChange && option.iconName) {
      onChange(option.iconName);
    }
    
    setIsModalVisible(false);
  };

  // Tìm option được chọn dựa trên iconName
  const getSelectedOption = (): ImageOption | undefined => {
    if (!value) return undefined;
    
    const imageUrl = getImageUrl(value);
    return imageOptions.find(option => option.url === imageUrl);
  };

  // Hiển thị tên thiết bị được chọn
  const getSelectedName = (): string => {
    const option = getSelectedOption();
    return option ? option.name : 'Chưa chọn biểu tượng';
  };

  return (
    <>
      <Card 
        hoverable 
        onClick={() => setIsModalVisible(true)}
        style={{ width: '100%', textAlign: 'center' }}
        bodyStyle={{ padding: '12px' }}
      >
        <div className="flex items-center justify-center">
          <img 
            src={getImageUrl(value || '')} 
            alt="Equipment Icon" 
            style={{ width: '48px', height: '48px', marginRight: '12px' }} 
          />
          <div className="text-left">
            <div className="text-sm text-gray-500">Biểu tượng thiết bị</div>
            <div>{getSelectedName()}</div>
          </div>
        </div>
      </Card>

      <Modal
        title="Chọn biểu tượng thiết bị"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <div className="mb-4">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm biểu tượng..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: 16 }}
          />

          <div className="flex justify-between items-center mb-3">
            <Radio.Group 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              buttonStyle="solid"
            >
              {categories.map(cat => (
                <Radio.Button key={cat.key} value={cat.key}>
                  {cat.name}
                </Radio.Button>
              ))}
            </Radio.Group>

            <Radio.Group 
              value={viewMode} 
              onChange={(e) => setViewMode(e.target.value)} 
              optionType="button" 
              buttonStyle="outline"
            >
              <Radio.Button value="grid"><AppstoreOutlined /></Radio.Button>
              <Radio.Button value="list"><BarsOutlined /></Radio.Button>
            </Radio.Group>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <Row gutter={[16, 16]}>
            {filteredOptions.map((option) => (
              <Col span={6} key={option.key}>
                <Card
                  hoverable
                  style={{ 
                    width: '100%', 
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: option.iconName === value ? '2px solid #1890ff' : '1px solid #f0f0f0'
                  }}
                  bodyStyle={{ padding: '12px' }}
                  onClick={() => handleSelectImage(option)}
                >
                  <img 
                    src={option.url} 
                    alt={option.name} 
                    style={{ 
                      width: '48px', 
                      height: '48px', 
                      marginBottom: '8px',
                      objectFit: 'contain'
                    }} 
                  />
                  <div style={{ fontSize: '12px', lineHeight: '1.2', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {option.name}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="border rounded-md">
            {filteredOptions.map((option) => (
              <div 
                key={option.key}
                className="flex items-center p-3 border-b cursor-pointer hover:bg-gray-50"
                style={{
                  backgroundColor: option.iconName === value ? '#e6f7ff' : undefined,
                  borderLeft: option.iconName === value ? '3px solid #1890ff' : undefined
                }}
                onClick={() => handleSelectImage(option)}
              >
                <img 
                  src={option.url} 
                  alt={option.name} 
                  style={{ width: '36px', height: '36px', marginRight: '16px' }} 
                />
                <div className="flex-1">
                  <div className="font-medium">{option.name}</div>
                  <div className="text-xs text-gray-500">{getCategoryForEquipment(option.key)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredOptions.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Không tìm thấy biểu tượng phù hợp
          </div>
        )}
      </Modal>
    </>
  );
};

export default ImageIconSelect;