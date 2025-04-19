// src/pages/site-layout/components/CanvasToolbar.tsx
import React, { useState } from 'react';
import { Button, Space, Tooltip } from 'antd';
import { 
  PlusOutlined, 
  UndoOutlined, 
  RedoOutlined,
  ToolOutlined,
  InboxOutlined,
  BorderOutlined,
  DatabaseOutlined,
  NodeIndexOutlined
} from '@ant-design/icons';
import { CanvasToolbarProps, ShapeType, Equipment } from '../types';
import EquipmentSelectionModal from './EquipmentSelectionModal';

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onAddShape,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
}) => {
  const [equipmentModalVisible, setEquipmentModalVisible] = useState(false);

  // Map biểu tượng cho các loại hình
  const shapeIcons: Record<ShapeType, React.ReactNode> = {
    equipment: <ToolOutlined />,
    material: <InboxOutlined />,
    zone: <BorderOutlined />,
    storage: <DatabaseOutlined />,
    path: <NodeIndexOutlined />
  };

  // Map nhãn để hiển thị
  const shapeLabels: Record<ShapeType, string> = {
    equipment: 'Thiết bị',
    material: 'Vật liệu',
    zone: 'Khu vực',
    storage: 'Kho',
    path: 'Đường đi'
  };

  // Danh sách các loại shape, ngoại trừ equipment (vì sẽ dùng modal)
  const shapeTypes: ShapeType[] = ['material', 'zone', 'storage', 'path'];
  
  // Xử lý khi chọn một thiết bị từ modal
  const handleEquipmentSelect = (equipment: Equipment) => {
    // Tạo một shape mới với thuộc tính từ thiết bị đã chọn
    onAddShape('equipment');
  };

  return (
    <>
      <div className="flex justify-between p-4 border-b">
        <Space size="small">
          {/* Nút thêm thiết bị */}
          <Tooltip title="Thêm thiết bị">
            <Button
              icon={shapeIcons.equipment}
              onClick={() => setEquipmentModalVisible(true)}
            >
              {shapeLabels.equipment}
            </Button>
          </Tooltip>

          {/* Các nút thêm shape khác */}
          {shapeTypes.map(type => (
            <Tooltip key={type} title={`Thêm ${shapeLabels[type].toLowerCase()}`}>
              <Button
                onClick={() => onAddShape(type)}
                icon={shapeIcons[type]}
              >
                {shapeLabels[type]}
              </Button>
            </Tooltip>
          ))}
        </Space>
        
        <Space size="small">
          <Button
            onClick={onUndo}
            disabled={!canUndo}
            icon={<UndoOutlined />}
          >
            Hoàn tác
          </Button>
          <Button
            onClick={onRedo}
            disabled={!canRedo}
            icon={<RedoOutlined />}
          >
            Làm lại
          </Button>
        </Space>
      </div>

      {/* Modal chọn thiết bị */}
      <EquipmentSelectionModal
        visible={equipmentModalVisible}
        onClose={() => setEquipmentModalVisible(false)}
        onSelectEquipment={handleEquipmentSelect}
      />
    </>
  );
};

export default CanvasToolbar;