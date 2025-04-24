// src/pages/site-layout/components/SaveLayoutModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';

const { TextArea } = Input;

interface SaveLayoutValues {
  name: string;
  description: string;
}

interface SaveLayoutModalProps {
  visible: boolean;
  initialValues: SaveLayoutValues;
  onCancel: () => void;
  onSave: (values: SaveLayoutValues) => void;
}

const SaveLayoutModal: React.FC<SaveLayoutModalProps> = ({
  visible,
  initialValues,
  onCancel,
  onSave
}) => {
  const [form] = Form.useForm<SaveLayoutValues>();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        onSave(values);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Lưu mặt bằng công trường"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Lưu
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="name"
          label="Tên mặt bằng"
          rules={[{ required: true, message: 'Vui lòng nhập tên mặt bằng' }]}
        >
          <Input placeholder="Nhập tên mặt bằng" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Mô tả"
        >
          <TextArea 
            rows={4} 
            placeholder="Nhập mô tả về mặt bằng (nếu có)" 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SaveLayoutModal;