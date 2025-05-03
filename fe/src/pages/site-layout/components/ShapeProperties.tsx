import React from 'react';
import { Button, Form, Input, InputNumber, Slider, message, Divider, Typography } from 'antd';
import { ShapePropertiesProps } from '../types';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, CloseOutlined } from '@ant-design/icons';

const { Title } = Typography;

export const ShapeProperties: React.FC<ShapePropertiesProps> = ({
  shape,
  onUpdate,
  onDelete,
  onClose
}) => {
  if (!shape) return null;

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
  
  // Tạo các hàm xử lý sự kiện riêng biệt và ổn định
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onUpdate({
      ...shape,
      name: newValue
    });
  };
  
  const handleXChange = (value: number | null) => {
    if (value !== null) {
      onUpdate({
        ...shape,
        x: value
      });
    }
  };
  
  const handleYChange = (value: number | null) => {
    if (value !== null) {
      onUpdate({
        ...shape,
        y: value
      });
    }
  };
  
  const handleWidthChange = (value: number | null) => {
    if (value !== null) {
      onUpdate({
        ...shape,
        width: value
      });
    }
  };
  
  const handleHeightChange = (value: number | null) => {
    if (value !== null) {
      onUpdate({
        ...shape,
        height: value
      });
    }
  };
  
  const handleRotationChange = (value: number | null) => {
    if (value !== null) {
      onUpdate({
        ...shape,
        rotation: value
      });
    }
  };
  
  const handleOpacityChange = (value: number) => {
    onUpdate({
      ...shape,
      opacity: value
    });
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...shape,
      fill: e.target.value
    });
  };

  return (
    <div className="p-3 h-full overflow-auto">
      <div className="flex justify-between items-center mb-3">
        <Title level={5} className="m-0">Thuộc tính đối tượng</Title>
        <Button 
          type="text" 
          icon={<CloseOutlined />} 
          onClick={onClose}
          size="small"
        />
      </div>
      
      <Form layout="vertical" size="small">
        <Form.Item label="Tên" className="mb-2">
          <Input
            value={shape.name || ''}
            onChange={handleNameChange}
          />
        </Form.Item>

        <Form.Item label="Loại" className="mb-2">
          <Input 
            value={getShapeTypeLabel(shape.type)} 
            readOnly 
            disabled
            prefix={<InfoCircleOutlined />}
          />
        </Form.Item>
        
        <Divider className="my-2" />
        
        <Form.Item label="Vị trí" className="mb-2">
          <div className="flex gap-1">
            <InputNumber
              addonBefore="X"
              value={Math.round(shape.x)}
              onChange={handleXChange}
              style={{ width: '100%' }}
              size="small"
            />
            <InputNumber
              addonBefore="Y"
              value={Math.round(shape.y)}
              onChange={handleYChange}
              style={{ width: '100%' }}
              size="small"
            />
          </div>
        </Form.Item>

        <Form.Item label="Kích thước" className="mb-2">
          <div className="flex gap-1">
            <InputNumber
              addonBefore="W"
              value={Math.round(shape.width)}
              onChange={handleWidthChange}
              style={{ width: '100%' }}
              size="small"
            />
            <InputNumber
              addonBefore="H"
              value={Math.round(shape.height)}
              onChange={handleHeightChange}
              style={{ width: '100%' }}
              size="small"
            />
          </div>
        </Form.Item>

        <Form.Item label="Góc xoay" className="mb-2">
          <Slider
            min={0}
            max={360}
            value={shape.rotation || 0}
            onChange={handleRotationChange}
          />
          <InputNumber
            value={shape.rotation || 0}
            onChange={handleRotationChange}
            style={{ width: '100%' }}
            size="small"
          />
        </Form.Item>

        <Form.Item label="Độ mờ" className="mb-2">
          <Slider
            min={0.1}
            max={1}
            step={0.1}
            value={shape.opacity}
            onChange={handleOpacityChange}
          />
        </Form.Item>

        <Form.Item label="Màu sắc" className="mb-3">
          <div className="flex items-center gap-1">
            <div
              className="w-5 h-5 rounded-full border"
              style={{ backgroundColor: shape.fill }}
            />
            <Input
              value={shape.fill}
              onChange={handleColorChange}
              size="small"
            />
          </div>
        </Form.Item>
      </Form>
      
      <div className="mt-2">
        <div className="flex gap-1">
          <Button
            danger
            type="primary"
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            style={{ width: '100%' }}
            size="small"
          >
            Xóa
          </Button>
          
          {shape.type === 'equipment' && (
            <Button
              type="default"
              icon={<EditOutlined />}
              style={{ width: '100%' }}
              size="small"
            >
              Thay đổi
            </Button>
          )}
        </div>
        
        <div className="text-xs text-gray-400 mt-1 text-center">
          Phím tắt: Delete
        </div>
      </div>
    </div>
  );
};

export default ShapeProperties;