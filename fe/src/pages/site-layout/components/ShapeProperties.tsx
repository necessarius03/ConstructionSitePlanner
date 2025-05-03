import React from 'react';
import { Button, Form, Input, InputNumber, Select, Slider } from 'antd';
import { ShapePropertiesProps } from '../types';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

export const ShapeProperties: React.FC<ShapePropertiesProps> = ({
  shape,
  onUpdate,
  onDelete
}) => {
  if (!shape) return null;

  const getShapeTypeLabel = (type: string) => {
    switch (type) {
      case 'equipment': return 'Thiết bị';
      case 'material': return 'Vật liệu';
      case 'zone': return 'Khu vực';
      case 'storage': return 'Kho chứa';
      case 'path': return 'Đường đi';
      default: return type;
    }
  };

  return (
    <div className="w-64 p-4 border-l">
      <h3 className="font-semibold mb-4">Thuộc tính đối tượng</h3>
      
      <Form layout="vertical" className="space-y-4">
        <Form.Item label="Tên">
          <Input
            value={shape.name || ''}
            onChange={(e) => onUpdate({ ...shape, name: e.target.value })}
          />
        </Form.Item>

        <Form.Item label="Loại">
          <Input 
            value={getShapeTypeLabel(shape.type)} 
            readOnly 
            disabled
          />
        </Form.Item>

        <Form.Item label="Kích thước">
          <div className="flex gap-2">
            <InputNumber
              addonBefore="W"
              value={shape.width}
              onChange={(value) => onUpdate({ ...shape, width: Number(value) })}
              style={{ width: '100%' }}
            />
            <InputNumber
              addonBefore="H"
              value={shape.height}
              onChange={(value) => onUpdate({ ...shape, height: Number(value) })}
              style={{ width: '100%' }}
            />
          </div>
        </Form.Item>

        <Form.Item label="Góc xoay">
          <Slider
            min={0}
            max={360}
            value={shape.rotation || 0}
            onChange={(value) => onUpdate({ ...shape, rotation: Number(value) })}
          />
          <InputNumber
            value={shape.rotation || 0}
            onChange={(value) => onUpdate({ ...shape, rotation: Number(value) })}
            style={{ width: '100%', marginTop: '8px' }}
          />
        </Form.Item>

        <Form.Item label="Độ mờ">
          <Slider
            min={0.1}
            max={1}
            step={0.1}
            value={shape.opacity}
            onChange={(value) => onUpdate({ ...shape, opacity: Number(value) })}
          />
        </Form.Item>

        <Form.Item label="Màu sắc">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: shape.fill }}
            />
            <Input
              value={shape.fill}
              onChange={(e) => onUpdate({ ...shape, fill: e.target.value })}
            />
          </div>
        </Form.Item>

        <Form.Item>
          <div className="flex gap-2">
            <Button
              danger
              type="default"
              icon={<DeleteOutlined />}
              onClick={() => onDelete(shape.id)}
              style={{ width: '100%' }}
            >
              Xóa
            </Button>
            {shape.type === 'equipment' && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                style={{ width: '100%' }}
              >
                Thay đổi
              </Button>
            )}
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};