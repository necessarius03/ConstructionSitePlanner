// fe/src/features/site-layout/components/EquipmentSelectModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, List, Card, Radio, Input, Empty, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import * as AntdIcons from '@ant-design/icons';
import EquipmentService, { Equipment } from '../../../services/EquipmentService';

interface EquipmentSelectModalProps {
  visible: boolean;
  onCancel: () => void;
  onSelect: (equipment: any) => void;
}

const EquipmentSelectModal: React.FC<EquipmentSelectModalProps> = ({
  visible,
  onCancel,
  onSelect,
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Thiết bị nặng', value: 'heavy' },
    { label: 'Thiết bị vận chuyển', value: 'transport' },
    { label: 'Thiết bị nâng', value: 'lifting' },
    { label: 'Thiết bị bê tông', value: 'concrete' },
    { label: 'Khác', value: 'other' },
  ];

  useEffect(() => {
    if (visible) {
      fetchEquipment();
    }
  }, [visible]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const data = await EquipmentService.getAllEquipment();
      setEquipment(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'heavy': return 'orange';
      case 'transport': return 'blue';
      case 'lifting': return 'red';
      case 'concrete': return 'green';
      default: return 'default';
    }
  };

  const handleSelectEquipment = (item: Equipment) => {
    // Get the icon component from the icon name
    const IconComponent = AntdIcons[item.iconName as keyof typeof AntdIcons] as React.ComponentType;
    
    const selectedEquipment = {
      id: Date.now(),
      name: item.name,
      icon: IconComponent,
      width: item.width,
      height: item.height,
      description: item.description,
      category: item.category,
      color: item.color,
      notes: item.notes,
      equipmentId: item.id
    };
    
    onSelect(selectedEquipment);
  };

  return (
    <Modal
      title="Chọn thiết bị"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <div className="mb-4">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm thiết bị..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-3"
        />
        
        <Radio.Group 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          buttonStyle="solid"
          className="flex flex-wrap gap-2"
        >
          {categories.map(category => (
            <Radio.Button key={category.value} value={category.value}>
              {category.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      {filteredEquipment.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
          dataSource={filteredEquipment}
          loading={loading}
          renderItem={(item) => {
            const IconComponent = AntdIcons[item.iconName as keyof typeof AntdIcons] as React.ComponentType;
            return (
              <List.Item>
                <Card
                  hoverable
                  className="cursor-pointer"
                  onClick={() => handleSelectEquipment(item)}
                  style={{ borderLeft: `3px solid ${item.color}` }}
                >
                  <div className="flex items-center">
                    <div
                      style={{
                        backgroundColor: item.color + '20',
                        padding: '8px',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        marginRight: '12px',
                      }}
                    >
                      {IconComponent && (
                        <IconComponent
                          style={{ color: item.color, fontSize: '24px' }}
                        />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <Tag color={getCategoryColor(item.category)} className="mt-1">
                        {categories.find(cat => cat.value === item.category)?.label.replace('Thiết bị ', '')}
                      </Tag>
                    </div>
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />
      ) : (
        <Empty description={loading ? "Đang tải..." : "Không tìm thấy thiết bị phù hợp"} />
      )}
    </Modal>
  );
};

export default EquipmentSelectModal;