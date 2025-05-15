// fe/src/features/equipment/components/EquipmentFormModal.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, ColorPicker, Button, Alert } from 'antd';
import { Space } from 'antd';
import { Equipment } from '../../../services/EquipmentService';
import ImageIconSelect from './ImageIconSelect';
import type { Color } from 'antd/es/color-picker';
import { getImageUrl } from '../../../constants/equipmentImages';

const { Option } = Select;
const { TextArea } = Input;

interface EquipmentFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: any) => void;
  equipment: Equipment | null;
  mode: 'add' | 'edit';
}

const EquipmentFormModal: React.FC<EquipmentFormModalProps> = ({
  visible,
  onCancel,
  onSave,
  equipment,
  mode
}) => {
  const [form] = Form.useForm();
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const [colorValue, setColorValue] = useState<string>('#1677ff');
  const [debugMode, setDebugMode] = useState(false); // Thêm mode debug để kiểm tra dữ liệu

  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && equipment) {
        // For edit mode, set form values from the selected equipment
        const iconName = equipment.iconName || '';
        setSelectedIcon(iconName);
        setColorValue(equipment.color || '#1677ff');
        
        // Log để debug
        console.log('Editing equipment with data:', equipment);
        console.log('Equipment iconName:', iconName);
        
        form.setFieldsValue({
          name: equipment.name,
          icon: iconName,
          width: equipment.width,
          height: equipment.height,
          description: equipment.description,
          category: equipment.category,
          color: equipment.color,
          notes: equipment.notes || ''
        });
      } else {
        // For add mode, reset the form
        form.resetFields();
        setSelectedIcon('BuildOutlined'); // Đặt giá trị mặc định
        form.setFieldsValue({ icon: 'BuildOutlined' }); // Đảm bảo form cũng có giá trị mặc định
        setColorValue('#1677ff');
      }
    }
  }, [visible, equipment, form, mode]);

  const handleFinish = (values: any) => {
    // Đảm bảo màu sắc được gửi đúng định dạng chuỗi
    const formattedValues = {
      ...values,
      color: colorValue // Sử dụng giá trị chuỗi màu
    };
    
    // Đảm bảo luôn có iconName
    if (!formattedValues.icon || formattedValues.icon.trim() === '') {
      formattedValues.icon = selectedIcon || 'BuildOutlined';
    }
    
    // Log dữ liệu trước khi gửi lên server
    console.log('Submitting equipment data:', formattedValues);
    console.log('Selected icon:', selectedIcon);
    
    onSave(formattedValues);
  };

  const handleColorChange = (color: Color) => {
    // Lưu giá trị màu dưới dạng chuỗi hex
    setColorValue(color.toHexString());
  };
  
  // Preview icon đã chọn
  const renderIconPreview = () => {
    if (!selectedIcon) return null;
    
    const imageUrl = getImageUrl(selectedIcon);
    
    return (
      <div className="text-center my-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
          <img 
            src={imageUrl} 
            alt="Equipment Icon" 
            style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
          />
        </div>
      </div>
    );
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  return (
    <Modal
      title={
        <div onClick={toggleDebugMode}>
          {mode === 'add' ? 'Thêm thiết bị mới' : 'Chỉnh sửa thiết bị'}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      {/* Toggle debug mode - Nhấn vào tiêu đề modal để bật/tắt */}
      <div className="absolute top-0 right-0 p-1">
        {debugMode && <span className="text-xs text-blue-500">Debug Mode On</span>}
      </div>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          category: 'other',
          width: 50,
          height: 50,
          color: '#1677ff',
          icon: 'BuildOutlined' // Đặt giá trị mặc định
        }}
      >
        <Form.Item
          name="name"
          label="Tên thiết bị"
          rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị' }]}
        >
          <Input placeholder="Nhập tên thiết bị" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Loại thiết bị"
          rules={[{ required: true, message: 'Vui lòng chọn loại thiết bị' }]}
        >
          <Select>
            <Option value="heavy">Thiết bị nặng</Option>
            <Option value="transport">Thiết bị vận chuyển</Option>
            <Option value="lifting">Thiết bị nâng</Option>
            <Option value="concrete">Thiết bị bê tông</Option>
            <Option value="other">Khác</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="icon"
          label="Biểu tượng thiết bị"
          rules={[{ required: true, message: 'Vui lòng chọn biểu tượng' }]}
        >
          <ImageIconSelect
            value={selectedIcon}
            onChange={(value) => {
              console.log('ImageIconSelect onChange called with:', value);
              setSelectedIcon(value);
              form.setFieldsValue({ icon: value });
            }}
          />
        </Form.Item>

        {/* Hiển thị preview của icon đã chọn */}
        {renderIconPreview()}

        {/* Debug information */}
        {debugMode && (
          <Alert
            message="Debug Information"
            description={
              <div>
                <p>Selected Icon: {selectedIcon}</p>
                <p>Form value for icon: {form.getFieldValue('icon')}</p>
                <p>Image URL: {getImageUrl(selectedIcon)}</p>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        {/* <Form.Item
          name="color"
          label="Màu sắc"
        >
          <ColorPicker 
            value={colorValue}
            onChange={handleColorChange}
            format="hex"
          />
        </Form.Item> */}

        <div className="flex gap-4">
          <Form.Item
            name="width"
            label="Chiều rộng"
            rules={[{ required: true, message: 'Vui lòng nhập chiều rộng' }]}
            className="flex-1"
          >
            <InputNumber min={10} max={200} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="height"
            label="Chiều cao"
            rules={[{ required: true, message: 'Vui lòng nhập chiều cao' }]}
            className="flex-1"
          >
            <InputNumber min={10} max={200} style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <Form.Item
          name="description"
          label="Mô tả"
        >
          <TextArea rows={3} placeholder="Mô tả thiết bị" />
        </Form.Item>
        
        <Form.Item
          name="notes"
          label="Ghi chú"
        >
          <TextArea rows={3} placeholder="Ghi chú thêm về thiết bị (nếu có)" />
        </Form.Item>

        <Form.Item className="mb-0 flex justify-end">
          <Space>
            <Button onClick={onCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              {mode === 'add' ? 'Thêm thiết bị' : 'Lưu thay đổi'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EquipmentFormModal;