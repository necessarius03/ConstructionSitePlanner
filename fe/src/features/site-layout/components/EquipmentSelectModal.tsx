import React, { useState, useEffect } from 'react';
import { Modal, List, Card, Radio, Input, Empty, Tag, Spin } from 'antd';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import EquipmentService, { Equipment } from '../../../services/EquipmentService';
import { getImageUrl } from '../../../constants/equipmentImages';

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
    console.log("Selected equipment:", item);
    console.log("iconName from API:", item.iconName);

    const selectedEquipment = {
      id: Date.now(),
      name: item.name,
      iconName: item.iconName,
      width: item.width,
      height: item.height,
      description: item.description,
      category: item.category,
      color: item.color,
      notes: item.notes,
      equipmentId: item.id,
      fill: item.color,
      type: 'equipment',
      opacity: 1,
      x: 100,
      y: 100,
      isSelected: false
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

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          <span className="ml-2">Đang tải danh sách thiết bị...</span>
        </div>
      ) : filteredEquipment.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
          dataSource={filteredEquipment}
          renderItem={(item) => {
            // Lấy URL hình ảnh từ iconName
            const imageUrl = getImageUrl(item.iconName);
            
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
                      <img 
                        src={imageUrl} 
                        alt={item.name}
                        style={{ 
                          width: '32px', 
                          height: '32px',
                          objectFit: 'contain'
                        }}
                      />
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