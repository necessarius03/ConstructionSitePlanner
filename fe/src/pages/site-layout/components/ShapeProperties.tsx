// src/pages/site-layout/components/ShapeProperties.tsx
import React from 'react';
import { Button, Form, Input, InputNumber, Select, Typography, Divider } from 'antd';
import { ShapePropertiesProps } from '../types';

const { Text } = Typography;
const { Option } = Select;

export const ShapeProperties: React.FC<ShapePropertiesProps> = ({
  shape,
  onUpdate,
  onDelete
}) => {
  if (!shape) return null;

  // Tạo label thích hợp cho loại hình
  const getTypeLabel = (type: string): string => {
    const typeMap: Record<string, string> = {
      equipment: 'Thiết bị',
      material: 'Vật liệu',
      zone: 'Khu vực',
      storage: 'Kho',
      path: 'Đường đi'
    };
    return typeMap[type] || type;
  };

  return (
    <div className="w-64 p-4 border-l">
      <h3 className="font-semibold mb-2">Thuộc tính</h3>
      <Divider className="my-2" />
      
      <Form layout="vertical" className="space-y-2">
        <Form.Item label="Tên">
          <Input
            value={shape.name || ''}
            onChange={(e) => onUpdate({ ...shape, name: e.target.value })}
          />
        </Form.Item>
        
        <Form.Item label="Loại">
          <Text strong>{getTypeLabel(shape.type)}</Text>
          {shape.equipmentId && (
            <div className="mt-1">
              <Text type="secondary">ID: {shape.equipmentId}</Text>
            </div>
          )}
        </Form.Item>

        <Form.Item label="Vị trí X">
          <InputNumber
            value={Math.round(shape.x)}
            onChange={(value) => onUpdate({ ...shape, x: Number(value) })}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="Vị trí Y">
          <InputNumber
            value={Math.round(shape.y)}
            onChange={(value) => onUpdate({ ...shape, y: Number(value) })}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="Chiều rộng">
          <InputNumber
            value={Math.round(shape.width)}
            onChange={(value) => onUpdate({ ...shape, width: Number(value) })}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="Chiều cao">
          <InputNumber
            value={Math.round(shape.height)}
            onChange={(value) => onUpdate({ ...shape, height: Number(value) })}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="Góc xoay">
          <InputNumber
            value={Math.round(shape.rotation || 0)}
            onChange={(value) => onUpdate({ ...shape, rotation: Number(value) })}
            style={{ width: '100%' }}
            min={0}
            max={360}
          />
        </Form.Item>
        
        <Form.Item label="Màu sắc">
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-sm border border-gray-300" 
              style={{ backgroundColor: shape.fill }}
            />
            <Input
              value={shape.fill}
              onChange={(e) => onUpdate({ ...shape, fill: e.target.value })}
              className="flex-1"
            />
          </div>
        </Form.Item>
        
        <Form.Item label="Độ trong suốt">
          <InputNumber
            value={shape.opacity}
            onChange={(value) => onUpdate({ ...shape, opacity: Number(value) })}
            style={{ width: '100%' }}
            min={0}
            max={1}
            step={0.1}
          />
        </Form.Item>

        <Divider className="my-2" />
        
        <Form.Item>
          <Button
            danger
            type="primary"
            onClick={() => onDelete(shape.id)}
            style={{ width: '100%' }}
          >
            Xóa đối tượng
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ShapeProperties;