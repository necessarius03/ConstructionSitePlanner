import React, { useState, useEffect } from 'react';
import { Timeline, Card, Typography, Spin, Empty, Tag, Button, Tooltip } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined, 
  MinusCircleOutlined,
  PlusOutlined,
  EditOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Progress, ProgressStatus } from '../../../services/ProgressService';

const { Title, Text } = Typography;

interface ProgressTimelineProps {
  progress: Progress[];
  loading: boolean;
  onAdd?: () => void;
  onEdit?: (progress: Progress) => void;
}

const ProgressTimeline: React.FC<ProgressTimelineProps> = ({
  progress,
  loading,
  onAdd,
  onEdit
}) => {
  const [sortedProgress, setSortedProgress] = useState<Progress[]>([]);

  useEffect(() => {
    // Sắp xếp tiến độ theo ngày bắt đầu
    const sorted = [...progress].sort((a, b) => 
      dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf()
    );
    setSortedProgress(sorted);
  }, [progress]);

  const getTimelineItemColor = (status: ProgressStatus) => {
    switch (status) {
      case 'not_started':
        return 'gray';
      case 'in_progress':
        return 'blue';
      case 'completed':
        return 'green';
      case 'delayed':
        return 'red';
      default:
        return 'blue';
    }
  };

  const getStatusIcon = (status: ProgressStatus) => {
    switch (status) {
      case 'not_started':
        return <MinusCircleOutlined />;
      case 'in_progress':
        return <ClockCircleOutlined />;
      case 'completed':
        return <CheckCircleOutlined />;
      case 'delayed':
        return <ExclamationCircleOutlined />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: ProgressStatus) => {
    switch (status) {
      case 'not_started':
        return 'Chưa bắt đầu';
      case 'in_progress':
        return 'Đang thực hiện';
      case 'completed':
        return 'Hoàn thành';
      case 'delayed':
        return 'Bị trễ';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex justify-center items-center">
        <Spin tip="Đang tải tiến độ..." />
      </div>
    );
  }

  if (sortedProgress.length === 0) {
    return (
      <Empty 
        description="Chưa có tiến độ nào" 
        className="my-6"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      >
        {onAdd && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={onAdd}
          >
            Thêm tiến độ
          </Button>
        )}
      </Empty>
    );
  }

  return (
    <Card className="my-4">
      <div className="flex justify-between items-center mb-4">
        <Title level={4}>Dòng thời gian</Title>
        {onAdd && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={onAdd}
            size="small"
          >
            Thêm
          </Button>
        )}
      </div>
      
      <Timeline
        mode="left"
        items={sortedProgress.map(item => ({
          color: getTimelineItemColor(item.status),
          dot: getStatusIcon(item.status),
          label: (
            <div className="mr-4">
              <div>{dayjs(item.startDate).format('DD/MM/YYYY')}</div>
              <div className="text-xs text-gray-500">
                {item.actualStartDate 
                  ? `Bắt đầu: ${dayjs(item.actualStartDate).format('DD/MM/YYYY')}` 
                  : 'Chưa bắt đầu'}
              </div>
            </div>
          ),
          children: (
            <div className="bg-white p-3 border rounded-md relative">
              {onEdit && (
                <Tooltip title="Sửa">
                  <Button 
                    type="text" 
                    icon={<EditOutlined />} 
                    size="small" 
                    className="absolute top-2 right-2"
                    onClick={() => onEdit(item)}
                  />
                </Tooltip>
              )}
              
              <div className="flex justify-between items-start mb-2">
                <Text strong>{item.name}</Text>
                <Tag color={getTimelineItemColor(item.status)}>
                  {getStatusLabel(item.status)}
                </Tag>
              </div>
              
              <Text type="secondary" className="text-sm mb-2 block">
                {item.description}
              </Text>
              
              <div className="flex items-center justify-between text-sm">
                <div>
                  <div>Hoàn thành: {item.completionPercentage}%</div>
                  {item.responsiblePerson && (
                    <div>Người phụ trách: {item.responsiblePerson}</div>
                  )}
                </div>
                
                <div className="text-right">
                  <div>
                    Dự kiến kết thúc: {dayjs(item.endDate).format('DD/MM/YYYY')}
                  </div>
                  {item.actualEndDate && (
                    <div>
                      Kết thúc thực tế: {dayjs(item.actualEndDate).format('DD/MM/YYYY')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        }))}
      />
    </Card>
  );
};

export default ProgressTimeline;