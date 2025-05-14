import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Spin, Empty, Tooltip, Button } from 'antd';
import { GanttChart } from './GanttChart'; // Custom Gantt component
import { Progress } from '../../../services/ProgressService';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;

interface ProgressGanttChartProps {
  progress: Progress[];
  loading: boolean;
  onAdd?: () => void;
  onRefresh?: () => void;
}

// Cấu trúc dữ liệu cho biểu đồ Gantt
interface GanttItem {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  status: string;
  color: string;
  dependencies?: string[];
}

const ProgressGanttChart: React.FC<ProgressGanttChartProps> = ({
  progress,
  loading,
  onAdd,
  onRefresh
}) => {
  const [ganttData, setGanttData] = useState<GanttItem[]>([]);

  useEffect(() => {
    if (progress && progress.length > 0) {
      const transformedData = progress.map(item => ({
        id: item.id,
        name: item.name,
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate),
        progress: item.completionPercentage / 100,
        status: item.status,
        color: item.color,
        dependencies: item.dependsOn
      }));
      
      setGanttData(transformedData);
    } else {
      setGanttData([]);
    }
  }, [progress]);

  if (loading) {
    return (
      <div className="h-64 flex justify-center items-center">
        <Spin tip="Đang tải dữ liệu biểu đồ Gantt..." />
      </div>
    );
  }

  if (ganttData.length === 0) {
    return (
      <Empty 
        description="Không có dữ liệu tiến độ để hiển thị" 
        className="my-6"
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
        <Title level={4}>Biểu đồ Gantt</Title>
        <Space>
          {onRefresh && (
            <Tooltip title="Làm mới">
              <Button 
                icon={<ReloadOutlined />} 
                onClick={onRefresh}
              />
            </Tooltip>
          )}
          {onAdd && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={onAdd}
            >
              Thêm tiến độ
            </Button>
          )}
        </Space>
      </div>
      
      <div className="gantt-container" style={{ height: '500px', overflowX: 'auto' }}>
        <GanttChart 
          data={ganttData}
          viewMode="Month"
          onTaskClick={(task) => console.log('Task clicked:', task)}
        />
      </div>

      <div className="mt-4 text-xs text-gray-500">
        * Nếu các công việc có phụ thuộc (dependencies), biểu đồ sẽ hiển thị mối quan hệ giữa chúng.
      </div>
    </Card>
  );
};

export default ProgressGanttChart;