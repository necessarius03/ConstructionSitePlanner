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
  isLoading?: boolean;
}

const SaveLayoutModal: React.FC<SaveLayoutModalProps> = ({
  visible,
  initialValues,
  onCancel,
  onSave,
  isLoading = false
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
        <Button key="back" onClick={onCancel} disabled={isLoading}>
          Hủy
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleSubmit} 
          loading={isLoading}
        >
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
          rules={[
            { required: true, message: 'Vui lòng nhập tên mặt bằng' },
            { max: 100, message: 'Tên không được vượt quá 100 ký tự' }
          ]}
        >
          <Input 
            placeholder="Nhập tên mặt bằng" 
            disabled={isLoading}
            autoFocus
          />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ max: 500, message: 'Mô tả không được vượt quá 500 ký tự' }]}
        >
          <TextArea 
            rows={4} 
            placeholder="Nhập mô tả về mặt bằng (nếu có)" 
            disabled={isLoading}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SaveLayoutModal;