import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, InputNumber, ColorPicker, Button } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { Progress, ProgressStatus } from '../../../services/ProgressService';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface ProgressFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: any) => void;
  progress: Progress | null;
  mode: 'add' | 'edit';
  siteLayoutId: string;
}

const ProgressFormModal: React.FC<ProgressFormModalProps> = ({
  visible,
  onCancel,
  onSave,
  progress,
  mode,
  siteLayoutId
}) => {
  const [form] = Form.useForm();
  const [colorValue, setColorValue] = useState<string>('#1677ff');

  useEffect(() => {
    if (visible) {
      form.resetFields();
      
      if (mode === 'edit' && progress) {
        setColorValue(progress.color);
        
        form.setFieldsValue({
          name: progress.name,
          description: progress.description,
          zoneShapeId: progress.zoneShapeId,
          dateRange: [
            dayjs(progress.startDate),
            dayjs(progress.endDate)
          ],
          actualStartDate: progress.actualStartDate ? dayjs(progress.actualStartDate) : undefined,
          actualEndDate: progress.actualEndDate ? dayjs(progress.actualEndDate) : undefined,
          completionPercentage: progress.completionPercentage,
          status: progress.status,
          color: progress.color,
          responsiblePerson: progress.responsiblePerson,
          notes: progress.notes
        });
      } else {
        // Default values for new progress
        setColorValue('#1677ff');
        form.setFieldsValue({
          status: 'not_started',
          completionPercentage: 0,
          color: '#1677ff',
          dateRange: [dayjs(), dayjs().add(7, 'day')]
        });
      }
    }
  }, [visible, progress, form, mode]);

  const handleColorChange = (color: Color) => {
    setColorValue(color.toHexString());
    form.setFieldValue('color', color.toHexString());
  };

  const handleFinish = (values: any) => {
    onSave(values);
  };

  const statusOptions = [
    { value: 'not_started', label: 'Chưa bắt đầu' },
    { value: 'in_progress', label: 'Đang thực hiện' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'delayed', label: 'Bị trễ' }
  ];

  return (
    <Modal
      title={mode === 'add' ? 'Thêm tiến độ mới' : 'Chỉnh sửa tiến độ'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          name="name"
          label="Tên công việc"
          rules={[{ required: true, message: 'Vui lòng nhập tên công việc' }]}
        >
          <Input placeholder="Nhập tên công việc" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
        >
          <TextArea 
            placeholder="Mô tả chi tiết công việc" 
            rows={3}
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="dateRange"
            label="Thời gian dự kiến"
            rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian' }]}
          >
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="actualStartDate"
            label="Ngày bắt đầu thực tế"
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Chọn ngày bắt đầu thực tế"
            />
          </Form.Item>

          <Form.Item
            name="actualEndDate"
            label="Ngày kết thúc thực tế"
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Chọn ngày kết thúc thực tế"
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="completionPercentage"
            label="Tiến độ hoàn thành"
            rules={[{ required: true, message: 'Vui lòng nhập tiến độ' }]}
          >
            <InputNumber 
              min={0} 
              max={100} 
              formatter={value => `${value}%`}
              parser={value => value ? value.replace('%', '') : '0'}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="color"
            label="Màu sắc"
            rules={[{ required: true, message: 'Vui lòng chọn màu' }]}
          >
            <ColorPicker
              value={colorValue}
              onChange={handleColorChange}
              format="hex"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="responsiblePerson"
          label="Người phụ trách"
        >
          <Input placeholder="Nhập tên người phụ trách" />
        </Form.Item>

        {/* <Form.Item
          name="zoneShapeId"
          label="Khu vực trên mặt bằng (ID)"
        >
          <Input placeholder="Nhập ID ranh giới trên mặt bằng (nếu có)" />
        </Form.Item> */}

        <Form.Item
          name="notes"
          label="Ghi chú"
        >
          <TextArea 
            placeholder="Ghi chú thêm (nếu có)" 
            rows={3}
          />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end">
            <Button onClick={onCancel} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {mode === 'add' ? 'Thêm mới' : 'Cập nhật'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProgressFormModal;