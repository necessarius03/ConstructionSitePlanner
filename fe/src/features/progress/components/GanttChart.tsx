import React, { useState, useEffect, useRef } from 'react';
import { Gantt, Task, ViewMode, TaskType } from 'gantt-task-react';
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

// Create a React component for the tooltip instead of a string template
const TooltipContent = ({ task }: { task: GanttTask }) => {
  const statusLabel = getStatusLabel(task.status);
  
  return (
    <div className="gantt-tooltip" style={{ padding: '10px', background: 'white', border: '1px solid #ddd', borderRadius: '4px' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{task.name}</div>
      <div>Tiến độ: {Math.round(task.progress * 100)}%</div>
      <div>Bắt đầu: {task.start.toLocaleDateString()}</div>
      <div>Kết thúc: {task.end.toLocaleDateString()}</div>
      {task.status && <div>Trạng thái: {statusLabel}</div>}
    </div>
  );
};

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
        const formattedTasks = data.map(item => {
        const taskColor = item.color || '#1677ff';
        const isDelayed = item.status === 'delayed';
        
        return {
            id: item.id,
            name: item.name,
            start: new Date(item.startDate),
            end: new Date(item.endDate),
            progress: item.progress,
            type: 'task' as TaskType,
            styles: { 
            progressColor: taskColor,
            progressSelectedColor: taskColor, 
            backgroundColor: isDelayed ? '#fff1f0' : `${taskColor}30`,
            backgroundSelectedColor: isDelayed ? '#fff1f0' : `${taskColor}40`,
            },
            status: item.status,
            dependencies: item.dependencies || []
        };
        });
        
        setTasks(formattedTasks as GanttTask[]);
    } else {
        setTasks([]);
    }
    }, [data]);

  const handleViewChange = (mode: ViewMode) => {
    setCurrentViewMode(mode);
  };

  const handleZoomIn = () => {
  if (currentViewMode === ViewMode.Day) {
    setCurrentViewMode(ViewMode.HalfDay);
  } else if (currentViewMode === ViewMode.HalfDay) {
    setCurrentViewMode(ViewMode.QuarterDay);
  } else if (currentViewMode === ViewMode.QuarterDay) {
    setCurrentViewMode(ViewMode.Hour);
  }
};

const handleZoomOut = () => {
  if (currentViewMode === ViewMode.Day) {
    setCurrentViewMode(ViewMode.Week);
  } else if (currentViewMode === ViewMode.Week) {
    setCurrentViewMode(ViewMode.Month);
  } else if (currentViewMode === ViewMode.Month) {
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
  ];

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
            TooltipContent={TooltipContent}
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

// Helper function to get status label text
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

export default GanttChart;