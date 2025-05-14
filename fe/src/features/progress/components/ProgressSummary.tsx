import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Progress as AntProgress, Tag, Statistic, Button, Tooltip } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined, 
  CalendarOutlined,
  TeamOutlined,
  LineChartOutlined,
  EditOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Progress, ProgressStatus } from '../../../services/ProgressService';

const { Title, Text } = Typography;

interface ProgressSummaryProps {
  progress: Progress[];
  siteLayoutName: string;
  onEditProgress?: (progress: Progress) => void;
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ 
  progress, 
  siteLayoutName,
  onEditProgress
}) => {
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [inProgressTasks, setInProgressTasks] = useState(0);
  const [delayedTasks, setDelayedTasks] = useState(0);
  const [notStartedTasks, setNotStartedTasks] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [nearestDeadline, setNearestDeadline] = useState<Progress | null>(null);

  useEffect(() => {
    if (progress && progress.length > 0) {
      setTotalTasks(progress.length);
      
      const completed = progress.filter(item => item.status === 'completed').length;
      const inProgress = progress.filter(item => item.status === 'in_progress').length;
      const delayed = progress.filter(item => item.status === 'delayed').length;
      const notStarted = progress.filter(item => item.status === 'not_started').length;
      
      setCompletedTasks(completed);
      setInProgressTasks(inProgress);
      setDelayedTasks(delayed);
      setNotStartedTasks(notStarted);
      
      // Tính toán tiến độ tổng thể (trung bình)
      const totalPercentage = progress.reduce((sum, item) => sum + item.completionPercentage, 0);
      const avgPercentage = Math.round(totalPercentage / progress.length);
      setOverallProgress(avgPercentage);
      
      // Tìm deadline gần nhất
      const uncompleted = progress.filter(item => item.status !== 'completed');
      if (uncompleted.length > 0) {
        const nearest = uncompleted.reduce((prev, curr) => 
          dayjs(prev.endDate).isBefore(dayjs(curr.endDate)) ? prev : curr
        );
        setNearestDeadline(nearest);
      } else {
        setNearestDeadline(null);
      }
    }
  }, [progress]);

  const getProgressStatus = (percentage: number): 'success' | 'exception' | 'active' | 'normal' => {
    if (delayedTasks > 0) return 'exception';
    if (percentage === 100) return 'success';
    if (percentage > 0) return 'active';
    return 'normal';
  };

  const getDaysRemaining = (date: string): number => {
    const today = dayjs();
    const deadline = dayjs(date);
    return deadline.diff(today, 'day');
  };

  return (
    <Card className="mb-6">
      <Title level={4}>Tổng quan tiến độ: {siteLayoutName}</Title>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} sm={12} md={6}>
          <Statistic 
            title="Tổng số công việc" 
            value={totalTasks} 
            suffix={`/${totalTasks}`}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic 
            title="Tổng tiến độ" 
            value={overallProgress}
            suffix="%"
            valueStyle={{ color: overallProgress === 100 ? '#3f8600' : '#1677ff' }}
            prefix={<LineChartOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic 
            title="Đã hoàn thành" 
            value={completedTasks} 
            suffix={`/${totalTasks}`}
            valueStyle={{ color: '#3f8600' }}
            prefix={<CheckCircleOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic 
            title="Công việc bị trễ" 
            value={delayedTasks}
            valueStyle={{ color: delayedTasks > 0 ? '#cf1322' : '#3f8600' }}
            prefix={<ExclamationCircleOutlined />}
          />
        </Col>
      </Row>

      <div className="mt-6">
        <div className="mb-2 flex justify-between items-center">
          <Text strong>Tiến độ tổng thể</Text>
          <Text type="secondary">{overallProgress}%</Text>
        </div>
        <AntProgress 
          percent={overallProgress} 
          status={getProgressStatus(overallProgress)}
          strokeWidth={10}
        />
      </div>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} md={12}>
          <Card size="small" title="Phân loại công việc">
            <div className="flex flex-wrap gap-2">
              <Tag color="green" icon={<CheckCircleOutlined />}>
                Hoàn thành: {completedTasks}
              </Tag>
              <Tag color="blue" icon={<ClockCircleOutlined />}>
                Đang thực hiện: {inProgressTasks}
              </Tag>
              <Tag color="red" icon={<ExclamationCircleOutlined />}>
                Bị trễ: {delayedTasks}
              </Tag>
              <Tag color="default" icon={<ClockCircleOutlined />}>
                Chưa bắt đầu: {notStartedTasks}
              </Tag>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card 
            size="small" 
            title="Deadline gần nhất"
            extra={nearestDeadline && onEditProgress && (
              <Tooltip title="Chỉnh sửa">
                <Button 
                  type="text" 
                  size="small" 
                  icon={<EditOutlined />} 
                  onClick={() => onEditProgress(nearestDeadline)}
                />
              </Tooltip>
            )}
          >
            {nearestDeadline ? (
              <>
                <div className="mb-1">
                  <Text strong>{nearestDeadline.name}</Text>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <CalendarOutlined className="mr-1 text-gray-500" />
                      <span>{dayjs(nearestDeadline.endDate).format('DD/MM/YYYY')}</span>
                    </div>
                    <div className="mt-1 text-sm">
                      {nearestDeadline.responsiblePerson && (
                        <div className="flex items-center">
                          <TeamOutlined className="mr-1 text-gray-500" />
                          <span>{nearestDeadline.responsiblePerson}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div>
                      <AntProgress 
                        percent={nearestDeadline.completionPercentage} 
                        size="small" 
                        status={nearestDeadline.status === 'delayed' ? 'exception' : undefined}
                        style={{ width: 100 }}
                      />
                    </div>
                    <div className="mt-1">
                      {getDaysRemaining(nearestDeadline.endDate) > 0 ? (
                        <Tag color="blue">
                          Còn {getDaysRemaining(nearestDeadline.endDate)} ngày
                        </Tag>
                      ) : (
                        <Tag color="red">
                          Quá hạn {Math.abs(getDaysRemaining(nearestDeadline.endDate))} ngày
                        </Tag>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-2 text-gray-500">
                Không có deadline nào
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default ProgressSummary;