// src/pages/site-layout/components/EquipmentSelectionModal.tsx
import React from 'react';
import { Modal, Card, Row, Col, Typography } from 'antd';

const { Title, Text } = Typography;

export interface Equipment {
  id: string;
  name: string;
  icon: string; // SVG or icon name
  width: number;
  height: number;
  color: string;
  description?: string;
}

interface EquipmentSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectEquipment: (equipment: Equipment) => void;
}

// Danh sách các thiết bị xây dựng phổ biến
const EQUIPMENT_LIST: Equipment[] = [
  {
    id: 'tower-crane',
    name: 'Cần cẩu tháp',
    icon: '🏗️',
    width: 80,
    height: 80,
    color: '#f39c12',
    description: 'Dùng cho vận chuyển vật liệu theo chiều cao'
  },
  {
    id: 'excavator',
    name: 'Máy xúc',
    icon: '🚜',
    width: 60,
    height: 50,
    color: '#e67e22',
    description: 'Dùng cho đào đất và di chuyển vật liệu'
  },
  {
    id: 'concrete-mixer',
    name: 'Máy trộn bê tông',
    icon: '🔄',
    width: 50,
    height: 40,
    color: '#3498db',
    description: 'Dùng để trộn bê tông tại công trường'
  },
  {
    id: 'bulldozer',
    name: 'Máy ủi',
    icon: '🚧',
    width: 65,
    height: 45,
    color: '#f1c40f',
    description: 'Dùng cho san lấp và di chuyển đất'
  },
  {
    id: 'generator',
    name: 'Máy phát điện',
    icon: '⚡',
    width: 40,
    height: 40,
    color: '#95a5a6',
    description: 'Cung cấp điện cho công trường'
  },
  {
    id: 'container-office',
    name: 'Container văn phòng',
    icon: '🏢',
    width: 100,
    height: 40,
    color: '#2ecc71',
    description: 'Văn phòng tạm thời tại công trường'
  },
  {
    id: 'mobile-crane',
    name: 'Cần cẩu di động',
    icon: '🚛',
    width: 70,
    height: 60,
    color: '#e74c3c',
    description: 'Dùng cho vận chuyển vật liệu linh hoạt'
  },
  {
    id: 'scaffold',
    name: 'Giàn giáo',
    icon: '🔧',
    width: 60,
    height: 30,
    color: '#9b59b6',
    description: 'Hỗ trợ công việc trên cao'
  }
];

const EquipmentSelectionModal: React.FC<EquipmentSelectionModalProps> = ({
  visible,
  onClose,
  onSelectEquipment
}) => {
  return (
    <Modal
      title="Chọn thiết bị"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div className="pb-4">
        <Text type="secondary">
          Chọn thiết bị bạn muốn thêm vào mặt bằng công trường
        </Text>
      </div>
      
      <Row gutter={[16, 16]}>
        {EQUIPMENT_LIST.map((equipment) => (
          <Col xs={24} sm={12} md={8} lg={6} key={equipment.id}>
            <Card
              hoverable
              className="text-center"
              onClick={() => {
                onSelectEquipment(equipment);
                onClose();
              }}
              style={{ 
                borderColor: equipment.color,
                borderWidth: '2px'
              }}
            >
              <div className="text-3xl mb-2">{equipment.icon}</div>
              <Title level={5} style={{ margin: 0 }}>{equipment.name}</Title>
              <div className="text-xs text-gray-500 mt-1">
                {equipment.width} x {equipment.height}
              </div>
              <div className="text-xs mt-2 text-gray-600">
                {equipment.description}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

export default EquipmentSelectionModal;