import React from 'react';
import { Button, Space } from 'antd';
import { PlusOutlined, UndoOutlined, RedoOutlined } from '@ant-design/icons';
import { CanvasToolbarProps, ShapeType } from '../types';

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onAddShape,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
}) => {
  const shapeTypes: ShapeType[] = ['equipment', 'material', 'zone', 'storage', 'path'];

  return (
    <div className="flex justify-between p-4 border-b">
      <Space size="small">
        {shapeTypes.map(type => (
          <Button
            key={type}
            onClick={() => onAddShape(type)}
            icon={<PlusOutlined />}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
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