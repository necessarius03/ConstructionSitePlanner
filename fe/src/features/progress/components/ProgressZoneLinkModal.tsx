import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Alert, Button, Card, Space, Tag, Progress as AntProgress, Spin, Empty } from 'antd';
import { Progress } from '../../../services/ProgressService';
import { Shape } from '../../site-layout/types';

const { Option } = Select;

interface ProgressZoneLinkModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (progressId: string, zoneId: string) => void;
  progress: Progress[];
  shapes: Shape[];
  loading?: boolean;
}

const ProgressZoneLinkModal: React.FC<ProgressZoneLinkModalProps> = ({
  visible,
  onCancel,
  onSave,
  progress,
  shapes,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [selectedProgress, setSelectedProgress] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [progressInfo, setProgressInfo] = useState<Progress | null>(null);
  const [validZones, setValidZones] = useState<Shape[]>([]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setSelectedProgress(null);
      setSelectedZone(null);
      setProgressInfo(null);
      
      const boundaries = shapes.filter(shape => shape.type === 'boundary');
      setValidZones(boundaries);
    }
  }, [visible, form, shapes]);

  const handleProgressChange = (progressId: string) => {
    setSelectedProgress(progressId);
    const selected = progress.find(p => p.id === progressId) || null;
    setProgressInfo(selected);
    
    // If progress is already linked to a zone, pre-select it
    if (selected && selected.zoneShapeId) {
      setSelectedZone(selected.zoneShapeId);
      form.setFieldsValue({ zoneId: selected.zoneShapeId });
    } else {
      setSelectedZone(null);
    }
  };

  const handleZoneChange = (zoneId: string) => {
    setSelectedZone(zoneId);
  };

  const handleSubmit = () => {
    if (selectedProgress && selectedZone) {
      onSave(selectedProgress, selectedZone);
    }
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
        title="Liên kết tiến độ với ranh giới công trường"
        open={visible}
        onCancel={onCancel}
        footer={[
            <Button key="back" onClick={onCancel}>
            Hủy
            </Button>,
            <Button 
            key="submit" 
            type="primary" 
            onClick={handleSubmit}
            disabled={!selectedProgress || !selectedZone}
            >
            Liên kết
            </Button>
        ]}
        width={600}
        >
      {loading ? (
        <div className="flex justify-center py-6">
          <Spin />
        </div>
      ) : (
        <Form form={form} layout="vertical">
            <Form.Item
                name="zoneId"
                label="Chọn ranh giới"
                rules={[{ required: true, message: 'Vui lòng chọn ranh giới' }]}
                >
                <Select
                    placeholder="Chọn ranh giới công trường"
                    onChange={handleZoneChange}
                    showSearch
                    optionFilterProp="children"
                    disabled={!selectedProgress}
                >
                    {validZones.map(zone => (
                    <Option key={zone.id} value={zone.id.toString()}>
                        {zone.name || `Ranh giới ${zone.id}`}
                    </Option>
                    ))}
                </Select>
            </Form.Item>

          {progressInfo && (
            <Card size="small" className="mb-4">
              <div className="mb-2">
                <strong>{progressInfo.name}</strong> {getStatusTag(progressInfo.status)}
              </div>
              <p className="text-gray-500 text-sm mb-2">{progressInfo.description}</p>
              <AntProgress 
                percent={progressInfo.completionPercentage} 
                status={progressInfo.status === 'delayed' ? 'exception' : undefined} 
              />
            </Card>
          )}

          <Form.Item
            name="zoneId"
            label="Chọn khu vực"
            rules={[{ required: true, message: 'Vui lòng chọn khu vực' }]}
          >
            <Select
              placeholder="Chọn khu vực trên mặt bằng"
              onChange={handleZoneChange}
              showSearch
              optionFilterProp="children"
              disabled={!selectedProgress}
            >
              {validZones.map(zone => (
                <Option key={zone.id} value={zone.id.toString()}>
                  {zone.name || `Khu vực ${zone.id}`} ({zone.type})
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedProgress && selectedZone && (
            <Alert
              message="Liên kết này sẽ cho phép hiển thị tiến độ trực quan trên mặt bằng công trường"
              type="info"
              showIcon
            />
          )}

          {validZones.length === 0 && (
            <Empty 
              description="Không tìm thấy ranh giới trên mặt bằng" 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Form>
      )}
    </Modal>
  );
};

export default ProgressZoneLinkModal;