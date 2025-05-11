// Cập nhật BoundaryModal.tsx
import React from 'react';
import { Modal, Form, InputNumber, Input, Button, Checkbox } from 'antd';

interface BoundaryModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (width: number, height: number, name: string, isLocked: boolean) => void;
}

const BoundaryModal: React.FC<BoundaryModalProps> = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onConfirm(
        values.width, 
        values.height, 
        values.name, 
        values.isLocked === undefined ? true : values.isLocked
      );
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Thiết lập ranh giới công trường"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Tạo ranh giới
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ 
          width: 800, 
          height: 600, 
          name: 'Ranh giới công trường',
          isLocked: true
        }}
      >
        <Form.Item
          name="name"
          label="Tên ranh giới"
          rules={[{ required: true, message: 'Vui lòng nhập tên ranh giới' }]}
        >
          <Input placeholder="Nhập tên ranh giới" />
        </Form.Item>
        
        <Form.Item
          name="width"
          label="Chiều rộng (px)"
          rules={[{ required: true, message: 'Vui lòng nhập chiều rộng' }]}
        >
          <InputNumber min={200} max={2000} style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item
          name="height"
          label="Chiều dài (px)"
          rules={[{ required: true, message: 'Vui lòng nhập chiều dài' }]}
        >
          <InputNumber min={200} max={2000} style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item 
          name="isLocked" 
          valuePropName="checked"
        >
          <Checkbox>Khóa vị trí (tránh di chuyển vô tình)</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BoundaryModal;