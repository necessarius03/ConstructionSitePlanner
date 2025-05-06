import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Slider, message, Divider, Button, Space } from 'antd';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Shape } from '../types';

const { TextArea } = Input;

interface ShapePropertiesModalProps {
  visible: boolean;
  shape: Shape | null;
  onUpdate: (shape: Shape) => void;
  onDelete: (shapeId: number) => void;
  onCancel: () => void;
}

const ShapePropertiesModal: React.FC<ShapePropertiesModalProps> = ({
  visible,
  shape,
  onUpdate,
  onDelete,
  onCancel
}) => {
  // Local state to track changes without affecting the original shape
  const [editedShape, setEditedShape] = useState<Shape | null>(null);
  
  // Initialize local state when the modal becomes visible or shape changes
  useEffect(() => {
    if (visible && shape) {
      setEditedShape({ ...shape });
    }
  }, [visible, shape]);

  if (!shape || !editedShape) return null;

  const handleDelete = () => {
    try {
      if (shape && shape.id) {
        onDelete(shape.id);
        message.success('Đã xóa đối tượng thành công');
      }
    } catch (error) {
      console.error('Error deleting shape:', error);
      message.error('Lỗi khi xóa đối tượng');
    }
  };

  const handleSave = () => {
    if (editedShape) {
      onUpdate(editedShape);
      message.success('Đã lưu thay đổi');
      onCancel(); // Close the modal after saving
    }
  };

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
  
  // Update local state without affecting the original shape
  const updateLocalShape = (updates: Partial<Shape>) => {
    setEditedShape(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <Modal
      title="Thuộc tính đối tượng"
      open={visible}
      onCancel={onCancel}
      width={400}
      footer={[
        <Button key="delete" danger icon={<DeleteOutlined />} onClick={handleDelete}>
          Xóa
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="save" type="primary" icon={<SaveOutlined />} onClick={handleSave}>
          Lưu
        </Button>
      ]}
    >
      <Form layout="vertical" size="middle">
        <Form.Item label="Tên" className="mb-3">
          <Input
            value={editedShape.name || ''}
            onChange={(e) => updateLocalShape({ name: e.target.value })}
          />
        </Form.Item>

        <Form.Item label="Loại" className="mb-3">
          <Input 
            value={getShapeTypeLabel(editedShape.type)} 
            readOnly 
            disabled
            prefix={<InfoCircleOutlined />}
          />
        </Form.Item>
        
        <Divider className="my-3" />
        
        <Form.Item label="Vị trí" className="mb-3">
          <div className="flex gap-2">
            <InputNumber
              addonBefore="X"
              value={Math.round(editedShape.x)}
              onChange={(value) => updateLocalShape({ x: Number(value) })}
              style={{ width: '100%' }}
            />
            <InputNumber
              addonBefore="Y"
              value={Math.round(editedShape.y)}
              onChange={(value) => updateLocalShape({ y: Number(value) })}
              style={{ width: '100%' }}
            />
          </div>
        </Form.Item>

        <Form.Item label="Kích thước" className="mb-3">
          <div className="flex gap-2">
            <InputNumber
              addonBefore="W"
              value={Math.round(editedShape.width)}
              onChange={(value) => updateLocalShape({ width: Number(value) })}
              style={{ width: '100%' }}
            />
            <InputNumber
              addonBefore="H"
              value={Math.round(editedShape.height)}
              onChange={(value) => updateLocalShape({ height: Number(value) })}
              style={{ width: '100%' }}
            />
          </div>
        </Form.Item>

        <Form.Item label="Góc xoay" className="mb-3">
          <Slider
            min={0}
            max={360}
            value={editedShape.rotation || 0}
            onChange={(value) => updateLocalShape({ rotation: Number(value) })}
          />
          <InputNumber
            value={editedShape.rotation || 0}
            onChange={(value) => updateLocalShape({ rotation: Number(value) })}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="Độ mờ" className="mb-3">
          <Slider
            min={0.1}
            max={1}
            step={0.1}
            value={editedShape.opacity}
            onChange={(value) => updateLocalShape({ opacity: Number(value) })}
          />
        </Form.Item>

        <Form.Item label="Màu sắc" className="mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: editedShape.fill }}
            />
            <Input
              value={editedShape.fill}
              onChange={(e) => updateLocalShape({ fill: e.target.value })}
            />
          </div>
        </Form.Item>
        
        {/* Add the notes field here */}
        <Form.Item label="Ghi chú" className="mb-3">
          <TextArea
            value={editedShape.notes || ''}
            onChange={(e) => updateLocalShape({ notes: e.target.value })}
            rows={4}
            placeholder="Nhập ghi chú cho đối tượng này"
          />
        </Form.Item>
        
        {editedShape.type === 'equipment' && (
          <Form.Item className="mb-0">
            <Button
              type="default"
              icon={<EditOutlined />}
              style={{ width: '100%' }}
            >
              Thay đổi thiết bị
            </Button>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ShapePropertiesModal;