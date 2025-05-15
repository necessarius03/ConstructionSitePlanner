import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Alert, Button, Card, Space, Tag, Progress as AntProgress, Spin, Empty } from 'antd';
import { Progress } from '../../../services/ProgressService';
import { Shape } from '../../site-layout/types';
import { Stage, Layer, Rect, Text as KonvaText, Group } from 'react-konva';

const { Option } = Select;

interface ProgressZoneLinkModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (progressId: string, zoneId: string) => void;
  progress: Progress[];
  shapes: Shape[];
  loading?: boolean;
  preselectedZoneId?: string;
  preselectedProgressId?: string;
}

const ProgressZoneLinkModal: React.FC<ProgressZoneLinkModalProps> = ({
  visible,
  onCancel,
  onSave,
  progress,
  shapes,
  loading = false,
  preselectedZoneId,
  preselectedProgressId
}) => {
  const [form] = Form.useForm();
  const [selectedProgress, setSelectedProgress] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [progressInfo, setProgressInfo] = useState<Progress | null>(null);
  const [validZones, setValidZones] = useState<Shape[]>([]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      
      // Set preselected values if provided
      if (preselectedProgressId) {
        setSelectedProgress(preselectedProgressId);
        handleProgressChange(preselectedProgressId);
        form.setFieldsValue({ progressId: preselectedProgressId });
      } else {
        setSelectedProgress(null);
        setProgressInfo(null);
      }
      
      if (preselectedZoneId) {
        setSelectedZone(preselectedZoneId);
        form.setFieldsValue({ zoneId: preselectedZoneId });
      } else {
        setSelectedZone(null);
      }
      
      // Filter only boundary shapes
      const boundaries = shapes.filter(shape => shape.type === 'boundary');
      setValidZones(boundaries);
    }
  }, [visible, form, shapes, preselectedZoneId, preselectedProgressId]);

  const handleProgressChange = (progressId: string) => {
    setSelectedProgress(progressId);
    const selected = progress.find(p => p.id === progressId) || null;
    setProgressInfo(selected);
    
    // If progress is already linked to a zone, pre-select it
    if (selected && selected.zoneShapeId) {
      setSelectedZone(selected.zoneShapeId);
      form.setFieldsValue({ zoneId: selected.zoneShapeId });
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
      width={700}
    >
      {loading ? (
        <div className="flex justify-center py-6">
          <Spin />
        </div>
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item
            name="progressId"
            label="Chọn tiến độ"
            rules={[{ required: true, message: 'Vui lòng chọn tiến độ' }]}
          >
            <Select
              placeholder="Chọn tiến độ công việc"
              onChange={handleProgressChange}
              showSearch
              optionFilterProp="children"
            >
              {progress.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name} ({item.completionPercentage}% hoàn thành)
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

          {validZones.length > 0 && (
            <div className="mb-4 p-2 border rounded-lg bg-gray-50 overflow-auto" style={{ height: '300px' }}> 
                <Stage width={600} height={400} scale={{ x: 0.4, y: 0.4 }} draggable>
                    <Layer>
                    {validZones.map((zone, index) => (
                        <Group key={index}>
                        <Rect
                            x={zone.x}
                            y={zone.y}
                            width={zone.width}
                            height={zone.height}
                            stroke={selectedZone === zone.id.toString() ? "#1677ff" : "#000"}
                            strokeWidth={selectedZone === zone.id.toString() ? 2 : 1}
                            dash={[10, 5]}
                            fill="transparent"
                            onClick={() => {
                            setSelectedZone(zone.id.toString());
                            form.setFieldsValue({ zoneId: zone.id.toString() });
                            }}
                        />
                        {zone.name && (
                            <KonvaText
                            x={zone.x + 10}
                            y={zone.y + 10}
                            text={zone.name}
                            fontSize={12}
                            fill="#000"
                            />
                        )}
                        </Group>
                    ))}
                    </Layer>
                </Stage>
                </div>
          )}

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