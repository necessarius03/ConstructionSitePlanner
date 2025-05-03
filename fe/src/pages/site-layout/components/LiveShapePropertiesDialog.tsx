import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Slider, message, Divider, Button, Switch, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, SaveOutlined, SyncOutlined } from '@ant-design/icons';
import { Shape } from '../types';

interface LiveShapePropertiesDialogProps {
  visible: boolean;
  shape: Shape | null;
  onUpdate: (shape: Shape) => void;
  onPreview: (shape: Shape) => void; // Hàm xem trước thay đổi trên canvas
  onDelete: (shapeId: number) => void;
  onCancel: () => void;
}

const LiveShapePropertiesDialog: React.FC<LiveShapePropertiesDialogProps> = ({
  visible,
  shape,
  onUpdate,
  onPreview,
  onDelete,
  onCancel
}) => {
  // Local state để theo dõi thay đổi mà không ảnh hưởng đến shape gốc
  const [editedShape, setEditedShape] = useState<Shape | null>(null);
  // Chế độ xem trước (mặc định là bật)
  const [livePreview, setLivePreview] = useState(true);
  
  // Khởi tạo state cục bộ khi modal hiển thị hoặc shape thay đổi
  useEffect(() => {
    if (visible && shape) {
      setEditedShape({ ...shape });
    }
  }, [visible, shape]);

  // Không có shape hoặc editedShape thì không hiển thị
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
      onCancel(); // Đóng modal sau khi lưu
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
  
  // Cập nhật state cục bộ và gửi xem trước nếu bật chế độ xem trước
  const updateLocalShape = (updates: Partial<Shape>) => {
    const updatedShape = { ...editedShape, ...updates };
    setEditedShape(updatedShape);
    
    // Gửi xem trước nếu bật chế độ xem trước
    if (livePreview) {
      onPreview(updatedShape);
    }
  };

  return (
    <Modal
      title={
        <div className="flex justify-between items-center">
          <span>Thuộc tính đối tượng</span>
          <Tooltip title={livePreview ? 'Tắt xem trước trực tiếp' : 'Bật xem trước trực tiếp'}>
            <div className="flex items-center">
              <span className="mr-2 text-xs">Xem trước trực tiếp</span>
              <Switch
                checked={livePreview}
                onChange={(checked) => setLivePreview(checked)}
                size="small"
                checkedChildren={<SyncOutlined />}
              />
            </div>
          </Tooltip>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={400}
      maskClosable={false} // Ngăn đóng modal khi click bên ngoài
      keyboard={false} // Ngăn đóng modal khi nhấn ESC để tránh mất dữ liệu
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
              onChange={(value) => value !== null && updateLocalShape({ x: Number(value) })}
              style={{ width: '100%' }}
            />
            <InputNumber
              addonBefore="Y"
              value={Math.round(editedShape.y)}
              onChange={(value) => value !== null && updateLocalShape({ y: Number(value) })}
              style={{ width: '100%' }}
            />
          </div>
        </Form.Item>

        <Form.Item label="Kích thước" className="mb-3">
          <div className="flex gap-2">
            <InputNumber
              addonBefore="W"
              value={Math.round(editedShape.width)}
              onChange={(value) => value !== null && updateLocalShape({ width: Number(value) })}
              style={{ width: '100%' }}
            />
            <InputNumber
              addonBefore="H"
              value={Math.round(editedShape.height)}
              onChange={(value) => value !== null && updateLocalShape({ height: Number(value) })}
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
            onChange={(value) => value !== null && updateLocalShape({ rotation: Number(value) })}
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

export default LiveShapePropertiesDialog;