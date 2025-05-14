import React, { useState, useEffect, useRef } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { Button, Tooltip, Dropdown, Divider } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, FullscreenOutlined, MenuOutlined } from '@ant-design/icons';

interface GanttChartProps {
  data: any[];
  viewMode?: ViewMode;
  onTaskClick?: (task: Task) => void;
}

// Định nghĩa type cho Task
interface GanttTask extends Task {
  status?: string;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  data,
  viewMode = ViewMode.Month,
  onTaskClick
}) => {
  const [view, setView] = useState<ViewMode>(viewMode);
  const [tasks, setTasks] = useState<GanttTask[]>([]);
  const [currentViewMode, setCurrentViewMode] = useState<ViewMode>(viewMode);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      const formattedTasks = data.map(item => ({
        id: item.id,
        name: item.name,
        start: new Date(item.startDate),
        end: new Date(item.endDate),
        progress: item.progress,
        type: 'task',
        styles: { 
          progressColor: item.color || '#1677ff',
          progressSelectedColor: item.color || '#1677ff', 
          backgroundColor: (item.status === 'delayed' ? '#fff1f0' : 'white'),
          backgroundSelectedColor: (item.status === 'delayed' ? '#fff1f0' : '#fff7e6'),
        },
        status: item.status,
        dependencies: item.dependencies || []
      }));
      
      setTasks(formattedTasks);
    } else {
      setTasks([]);
    }
  }, [data]);

  const handleViewChange = (mode: ViewMode) => {
    setCurrentViewMode(mode);
  };

  const handleZoomIn = () => {
    if (currentViewMode === ViewMode.Year) {
      setCurrentViewMode(ViewMode.HalfYear);
    } else if (currentViewMode === ViewMode.HalfYear) {
      setCurrentViewMode(ViewMode.Quarter);
    } else if (currentViewMode === ViewMode.Quarter) {
      setCurrentViewMode(ViewMode.Month);
    } else if (currentViewMode === ViewMode.Month) {
      setCurrentViewMode(ViewMode.Week);
    } else if (currentViewMode === ViewMode.Week) {
      setCurrentViewMode(ViewMode.Day);
    }
  };

  const handleZoomOut = () => {
    if (currentViewMode === ViewMode.Day) {
      setCurrentViewMode(ViewMode.Week);
    } else if (currentViewMode === ViewMode.Week) {
      setCurrentViewMode(ViewMode.Month);
    } else if (currentViewMode === ViewMode.Month) {
      setCurrentViewMode(ViewMode.Quarter);
    } else if (currentViewMode === ViewMode.Quarter) {
      setCurrentViewMode(ViewMode.HalfYear);
    } else if (currentViewMode === ViewMode.HalfYear) {
      setCurrentViewMode(ViewMode.Year);
    }
  };

  const handleTaskClick = (task: Task) => {
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  const viewModeItems = [
    {
      key: ViewMode.Day,
      label: 'Ngày',
    },
    {
      key: ViewMode.Week,
      label: 'Tuần',
    },
    {
      key: ViewMode.Month,
      label: 'Tháng',
    },
    {
      key: ViewMode.Quarter,
      label: 'Quý',
    },
    {
      key: ViewMode.HalfYear,
      label: 'Nửa năm',
    },
    {
      key: ViewMode.Year,
      label: 'Năm',
    },
  ];

  const getTaskTooltipContent = (task: GanttTask) => {
    const statusLabel = getStatusLabel(task.status);
    return `
      <div class="gantt-tooltip">
        <div style="font-weight: bold; margin-bottom: 5px;">${task.name}</div>
        <div>Tiến độ: ${task.progress * 100}%</div>
        <div>Bắt đầu: ${task.start.toLocaleDateString()}</div>
        <div>Kết thúc: ${task.end.toLocaleDateString()}</div>
        ${task.status ? `<div>Trạng thái: ${statusLabel}</div>` : ''}
      </div>
    `;
  };

  const getStatusLabel = (status?: string) => {
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

  return (
    <div className="gantt-wrapper" ref={containerRef}>
      <div className="flex justify-between items-center mb-3">
        <div>
          <Dropdown
            menu={{
              items: viewModeItems,
              onClick: ({ key }) => handleViewChange(key as ViewMode)
            }}
          >
            <Button>
              {viewModeItems.find(item => item.key === currentViewMode)?.label || 'Thời gian'} <MenuOutlined />
            </Button>
          </Dropdown>
        </div>
        
        <div>
          <Tooltip title="Thu nhỏ">
            <Button icon={<ZoomOutOutlined />} onClick={handleZoomOut} style={{ marginRight: 8 }} />
          </Tooltip>
          <Tooltip title="Phóng to">
            <Button icon={<ZoomInOutlined />} onClick={handleZoomIn} />
          </Tooltip>
        </div>
      </div>
      
      <Divider style={{ margin: '8px 0' }} />
      
      <div className="gantt-container" style={{ height: '450px', overflowX: 'auto' }}>
        {tasks.length > 0 ? (
          <Gantt
            tasks={tasks}
            viewMode={currentViewMode}
            onDoubleClick={handleTaskClick}
            listCellWidth="250px"
            columnWidth={currentViewMode === ViewMode.Day ? 50 : 65}
            TooltipContent={getTaskTooltipContent as any}
          />
        ) : (
          <div className="text-center py-12 text-gray-500">
            Không có dữ liệu tiến độ để hiển thị
          </div>
        )}
      </div>
    </div>
  );
};

export default GanttChart;