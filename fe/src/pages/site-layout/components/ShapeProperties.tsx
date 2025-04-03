import React from 'react';
import { Button, Form, Input, InputNumber } from 'antd';
import { ShapePropertiesProps } from '../types';

export const ShapeProperties: React.FC<ShapePropertiesProps> = ({
  shape,
  onUpdate,
  onDelete
}) => {
  if (!shape) return null;

  return (
    <div className="w-64 p-4 border-l">
      <h3 className="font-semibold mb-4">Properties</h3>
      
      <Form layout="vertical" className="space-y-4">
        <Form.Item label="Name">
          <Input
            value={shape.name || ''}
            onChange={(e) => onUpdate({ ...shape, name: e.target.value })}
          />
        </Form.Item>

        <Form.Item label="Width">
          <InputNumber
            value={shape.width}
            onChange={(value) => onUpdate({ ...shape, width: Number(value) })}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="Height">
          <InputNumber
            value={shape.height}
            onChange={(value) => onUpdate({ ...shape, height: Number(value) })}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="Rotation">
          <InputNumber
            value={shape.rotation || 0}
            onChange={(value) => onUpdate({ ...shape, rotation: Number(value) })}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            danger
            type="primary"
            onClick={() => onDelete(shape.id)}
            style={{ width: '100%' }}
          >
            Delete Shape
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};