import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Slider, message, Divider, Button, Space, Switch, Typography, Tag, Progress as AntProgress } from 'antd';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, SaveOutlined, FieldTimeOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Shape } from '../types';
import { Progress } from '../../../services/ProgressService';

const { TextArea } = Input;
const { Text } = Typography;

interface ShapePropertiesModalProps {
  visible: boolean;
  shape: Shape | null;
  onUpdate: (shape: Shape) => void;
  onDelete: (shapeId: number) => void;
  onCancel: () => void;
  onLinkProgress?: (shapeId: string) => void;
  linkedProgress?: Progress[];
}

const ShapePropertiesModal: React.FC<ShapePropertiesModalProps> = ({
  visible,
  shape,
  onUpdate,
  onDelete,
  onCancel,
  onLinkProgress,
  linkedProgress = []
}) => {
  const [editedShape, setEditedShape] = useState<Shape | null>(null);
  
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
      onCancel();
    }
  };

  const getShapeTypeLabel = (type: string) => {
    switch (type) {
      case 'equipment': return 'Thiết bị';
      case 'material': return 'Vật liệu';
      case 'zone': return 'Khu vực';
      case 'storage': return 'Kho chứa';
      case 'path': return 'Đường đi';
      case 'boundary': return 'Ranh giới';
      default: return type;
    }
  };
  
  const updateLocalShape = (updates: Partial<Shape>) => {
    setEditedShape(prev => prev ? { ...prev, ...updates } : null);
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'not_started':
        return <Tag color="default">Chưa bắt đầu</Tag>;
      case 'in_progress':
        return <Tag color="processing">Đang thực hiện</Tag>;
      case 'completed':
        return <Tag color="success">Hoàn thành</Tag>;
      case 'delayed':
        return <Tag color="error">Bị trễ</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
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

        {editedShape.type === 'boundary' && (
          <>
            <Divider className="my-3" />
            <Form.Item label="Khóa vị trí" className="mb-3">
              <Switch
                checkedChildren={<LockOutlined />}
                unCheckedChildren={<UnlockOutlined />}
                checked={editedShape.isLocked}
                onChange={(checked) => updateLocalShape({ isLocked: checked })}
                style={{ 
                  backgroundColor: editedShape.isLocked ? '#f5222d' : '#1677ff' 
                }}
              />
            </Form.Item>
          </>
        )}

        {/* <Form.Item label="Màu sắc" className="mb-3">
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
        </Form.Item> */}
        
        <Form.Item label="Ghi chú" className="mb-3">
          <TextArea
            value={editedShape.notes || ''}
            onChange={(e) => updateLocalShape({ notes: e.target.value })}
            rows={4}
            placeholder="Nhập ghi chú cho đối tượng này"
          />
        </Form.Item>  

        {editedShape.type === 'boundary' && (
          <>
            <Divider className="my-3" />
            <Form.Item label="Tiến độ liên kết" className="mb-3">
              {linkedProgress && linkedProgress.length > 0 ? (
                <div className="space-y-2">
                  {linkedProgress.map(progress => (
                    <div key={progress.id} className="p-2 border rounded-md">
                      <div className="flex justify-between">
                        <Text strong>{progress.name}</Text>
                        {getStatusTag(progress.status)}
                      </div>
                      <div className="mt-1">
                        <Text type="secondary" className="text-xs">{progress.description}</Text>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between mb-1">
                          <Text className="text-xs">Tiến độ:</Text>
                          <Text className="text-xs">{progress.completionPercentage}%</Text>
                        </div>
                        <AntProgress 
                          percent={progress.completionPercentage} 
                          status={progress.status === 'delayed' ? 'exception' : undefined} 
                          size="small"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Button 
                  icon={<FieldTimeOutlined />} 
                  onClick={() => onLinkProgress && onLinkProgress(editedShape.id.toString())}
                >
                  Liên kết tiến độ
                </Button>
              )}
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ShapePropertiesModal;