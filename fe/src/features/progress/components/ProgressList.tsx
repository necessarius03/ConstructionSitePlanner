import React, { useState, useEffect } from 'react';
import { Card, Typography, List, Button, Space, Tag, Progress as AntProgress, Tooltip, Empty, Spin } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined, 
  MinusCircleOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Progress, ProgressStatus } from '../../../services/ProgressService';

const { Title, Text } = Typography;

interface ProgressListProps {
  progress: Progress[];
  loading: boolean;
  onEdit?: (progress: Progress) => void;
  onDelete?: (progressId: string) => void;
  onStatusChange?: (progressId: string, status: ProgressStatus) => void;
}

const ProgressList: React.FC<ProgressListProps> = ({
  progress,
  loading,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const [filteredProgress, setFilteredProgress] = useState<Progress[]>([]);

  useEffect(() => {
    // Sort progress by date
    const sorted = [...progress].sort((a, b) => 
      dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf()
    );
    setFilteredProgress(sorted);
  }, [progress]);

  const getStatusTag = (status: ProgressStatus) => {
    switch (status) {
      case 'not_started':
        return <Tag icon={<MinusCircleOutlined />} color="default">Chưa bắt đầu</Tag>;
      case 'in_progress':
        return <Tag icon={<ClockCircleOutlined />} color="processing">Đang thực hiện</Tag>;
      case 'completed':
        return <Tag icon={<CheckCircleOutlined />} color="success">Hoàn thành</Tag>;
      case 'delayed':
        return <Tag icon={<ExclamationCircleOutlined />} color="error">Bị trễ</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const getTimeRemaining = (endDate: string) => {
    const now = dayjs();
    const end = dayjs(endDate);
    const days = end.diff(now, 'day');
    
    if (days < 0) {
      return <Tag color="error">Quá hạn {Math.abs(days)} ngày</Tag>;
    } else if (days === 0) {
      return <Tag color="warning">Hạn hôm nay</Tag>;
    } else if (days <= 7) {
      return <Tag color="warning">Còn {days} ngày</Tag>;
    } else {
      return <Tag color="default">Còn {days} ngày</Tag>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spin tip="Đang tải danh sách tiến độ..." />
      </div>
    );
  }

  if (filteredProgress.length === 0) {
    return <Empty description="Không có dữ liệu tiến độ" className="py-8" />;
  }

  return (
    <div className="progress-list">
      <List
        itemLayout="vertical"
        dataSource={filteredProgress}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            className="mb-4 border rounded-md p-4"
            style={{ 
              borderLeft: `4px solid ${item.color}`,
              backgroundColor: item.status === 'delayed' ? '#fff1f0' : 'white'
            }}
            actions={[
              <AntProgress 
                key="progress" 
                percent={item.completionPercentage} 
                size="small" 
                status={item.status === 'delayed' ? 'exception' : undefined} 
                style={{ width: 120 }}
              />,
              getTimeRemaining(item.endDate),
              <Space key="actions" size="small">
                {onStatusChange && item.status !== 'completed' && (
                  <Tooltip title="Đánh dấu hoàn thành">
                    <Button
                      type="text"
                      icon={<CheckCircleOutlined />}
                      onClick={() => onStatusChange(item.id, 'completed')}
                      size="small"
                      style={{ color: 'green' }}
                    />
                  </Tooltip>
                )}
                {onEdit && (
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(item)}
                    size="small"
                  />
                )}
                {onDelete && (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete(item.id)}
                    size="small"
                  />
                )}
              </Space>
            ]}
          >
            <List.Item.Meta
              title={
                <div className="flex justify-between items-center">
                  <Text strong>{item.name}</Text>
                  {getStatusTag(item.status)}
                </div>
              }
              description={
                <div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-gray-500 text-xs">
                      {dayjs(item.startDate).format('DD/MM/YYYY')} - {dayjs(item.endDate).format('DD/MM/YYYY')}
                    </div>
                    {item.responsiblePerson && (
                      <div className="text-xs">
                        Người phụ trách: {item.responsiblePerson}
                      </div>
                    )}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ProgressList;