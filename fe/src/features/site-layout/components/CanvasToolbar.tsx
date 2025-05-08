// src/pages/site-layout/components/CanvasToolbar.tsx
import React from 'react';
import { Button, Space } from 'antd';
import { 
  // PlusOutlined, 
  UndoOutlined, 
  RedoOutlined, 
  BuildOutlined,
  InboxOutlined,
  PartitionOutlined,
  DatabaseOutlined,
  NodeIndexOutlined,
  BorderOutlined
} from '@ant-design/icons';
import { CanvasToolbarProps, ShapeType } from '../types';

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onAddShape,
  onShowEquipmentModal,
  onUndo,
  onRedo,
  onAddBoundary,
  canUndo = false,
  canRedo = false
}) => {
  // Định nghĩa các nút cho các loại hình khác nhau
  const shapeButtons = [
    { 
      type: 'equipment' as ShapeType, 
      label: 'Thiết bị', 
      icon: <BuildOutlined />,
      onClick: () => onShowEquipmentModal?.()
    },
    { 
      type: 'material' as ShapeType, 
      label: 'Vật liệu', 
      icon: <InboxOutlined />,
      onClick: () => onAddShape('material')
    },
    { 
      type: 'zone' as ShapeType, 
      label: 'Khu vực', 
      icon: <PartitionOutlined />,
      onClick: () => onAddShape('zone')
    },
    { 
      type: 'storage' as ShapeType, 
      label: 'Kho chứa', 
      icon: <DatabaseOutlined />,
      onClick: () => onAddShape('storage')
    },
    { 
      type: 'path' as ShapeType, 
      label: 'Đường đi', 
      icon: <NodeIndexOutlined />,
      onClick: () => onAddShape('path')
    },
    { 
      type: 'boundary' as ShapeType, 
      label: 'Ranh giới', 
      icon: <BorderOutlined />,
      onClick: () => onAddBoundary?.()
    }
  ];

  return (
    <div className="flex justify-between p-4 border-b">
      <Space size="small">
        {shapeButtons.map(button => (
          <Button
            key={button.type}
            onClick={button.onClick}
            icon={button.icon}
          >
            {button.label}
          </Button>
        ))}
      </Space>
      <Space size="small">
        <Button
          onClick={onUndo}
          disabled={!canUndo}
          icon={<UndoOutlined />}
        >
          Undo
        </Button>
        <Button
          onClick={onRedo}
          disabled={!canRedo}
          icon={<RedoOutlined />}
        >
          Redo
        </Button>
      </Space>
    </div>
  );
};

export default CanvasToolbar;