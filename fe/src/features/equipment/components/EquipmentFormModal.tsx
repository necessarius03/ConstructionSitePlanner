// fe/src/features/equipment/components/EquipmentFormModal.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, ColorPicker, Button } from 'antd';
import { Space } from 'antd';
import * as AntdIcons from '@ant-design/icons';
import { Equipment } from '../../../services/EquipmentService';

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
  const [iconOptions, setIconOptions] = useState<string[]>([]);

  useEffect(() => {
    // Extract icon component names from AntdIcons
    const icons = Object.keys(AntdIcons).filter(key => 
      key.endsWith('Outlined') && typeof AntdIcons[key as keyof typeof AntdIcons] === 'function'
    );
    setIconOptions(icons);
  }, []);

  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && equipment) {
        // For edit mode, set form values from the selected equipment
        const iconName = equipment.iconName || '';
        setSelectedIcon(iconName);
        
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
        setSelectedIcon('');
      }
    }
  }, [visible, equipment, form, mode]);

  const handleFinish = (values: any) => {
    onSave(values);
  };

  const renderIconPreview = () => {
    if (!selectedIcon) return null;
    
    const IconComponent = AntdIcons[selectedIcon as keyof typeof AntdIcons] as React.ComponentType;
    if (!IconComponent) return null;
    
    const color = form.getFieldValue('color') || '#1677ff';
    
    return (
      <div className="text-center my-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
          <IconComponent style={{ fontSize: 32, color }} />
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={mode === 'add' ? 'Thêm thiết bị mới' : 'Chỉnh sửa thiết bị'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          category: 'other',
          width: 50,
          height: 50,
          color: '#1677ff',
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
          label="Biểu tượng"
          rules={[{ required: true, message: 'Vui lòng chọn biểu tượng' }]}
        >
          <Select
            showSearch
            placeholder="Chọn biểu tượng"
            onChange={(value) => setSelectedIcon(value)}
            filterOption={(input, option) =>
              (option?.value as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {iconOptions.map(icon => (
              <Option key={icon} value={icon}>
                <Space>
                  {React.createElement(AntdIcons[icon as keyof typeof AntdIcons] as React.ComponentType)}
                  {icon.replace('Outlined', '')}
                </Space>
              </Option>
            ))}
          </Select>
        </Form.Item>

        {renderIconPreview()}

        <Form.Item
          name="color"
          label="Màu sắc"
        >
          <ColorPicker />
        </Form.Item>

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