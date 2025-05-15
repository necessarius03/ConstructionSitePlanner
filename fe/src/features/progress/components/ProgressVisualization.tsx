import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Empty, Typography, Progress as AntProgress, Tooltip, Button } from 'antd';
import { Stage, Layer, Rect, Text as KonvaText, Group } from 'react-konva';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Progress, ProgressStatus } from '../../../services/ProgressService';

const { Title, Text } = Typography;

interface ProgressVisualizationProps {
  progress: Progress[];
  siteLayout: any;
  loading: boolean;
}

const ProgressVisualization: React.FC<ProgressVisualizationProps> = ({
  progress,
  siteLayout,
  loading
}) => {
  const [shapes, setShapes] = useState<any[]>([]);
  const [progressByZone, setProgressByZone] = useState<{ [key: string]: Progress[] }>({});
  const [stageWidth, setStageWidth] = useState(800);
  const [stageHeight, setStageHeight] = useState(600);
  const [scale, setScale] = useState(1);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{x: number, y: number} | null>(null);
  const [tooltipContent, setTooltipContent] = useState<string>('');

  useEffect(() => {
    if (siteLayout && siteLayout.shapes) {
      setShapes(siteLayout.shapes);
      
      // Find boundary to set canvas size
      const boundary = siteLayout.shapes.find((shape: any) => shape.type === 'boundary');
      if (boundary) {
        setStageWidth(boundary.width + 100);
        setStageHeight(boundary.height + 100);
      }
    }
  }, [siteLayout]);

  useEffect(() => {
    if (progress && progress.length > 0 && shapes && shapes.length > 0) {
      // Group progress by zone
      const progressMap: { [key: string]: Progress[] } = {};
      
      progress.forEach(item => {
        if (item.zoneShapeId) {
          if (!progressMap[item.zoneShapeId]) {
            progressMap[item.zoneShapeId] = [];
          }
          progressMap[item.zoneShapeId].push(item);
        }
      });
      
      setProgressByZone(progressMap);
    }
  }, [progress, shapes]);

  const renderShapes = () => {
    if (!shapes || shapes.length === 0) return null;

    return shapes.map((shape: any, index: number) => {
      if (shape.type === 'boundary') {
        const shapeId = shape.id.toString();
        const hasProgress = progressByZone[shapeId] && progressByZone[shapeId].length > 0;
        const progressItems = hasProgress ? progressByZone[shapeId] : [];
        
        // Calculate overall progress for this boundary
        const overallProgress = progressItems.length > 0
          ? Math.round(progressItems.reduce((sum, item) => sum + item.completionPercentage, 0) / progressItems.length)
          : 0;
          
        // Check if boundary has delayed tasks
        const hasDelayed = progressItems.some(item => item.status === 'delayed');
        
        // Determine boundary color based on tasks
        let strokeColor = "#000";
        let strokeWidth = 1.5;
        
        if (hasProgress) {
          if (hasDelayed) {
            strokeColor = '#ff4d4f'; // Red for delayed
            strokeWidth = 2;
          } else if (overallProgress === 100) {
            strokeColor = '#52c41a'; // Green for completed
            strokeWidth = 2;
          } else if (overallProgress > 0) {
            strokeColor = '#1677ff'; // Blue for in progress
            strokeWidth = 2;
          }
        }
        
        return (
          <Group 
            key={`shape-${index}`}
            onMouseEnter={(e) => {
              setHoveredZoneId(shapeId);
              // Lấy vị trí chuột tương đối với stage
              const stage = e.target.getStage();
              if (stage) {
                const position = stage.getPointerPosition();
                if (position) {
                  setTooltipPosition({
                    x: position.x + 10,
                    y: position.y + 10
                  });
                  setTooltipContent(shape.name || 'Ranh giới');
                }
              }
            }}
            onMouseLeave={() => {
              setHoveredZoneId(null);
              setTooltipPosition(null);
            }}
            onMouseMove={(e) => {
              // Cập nhật vị trí tooltip khi di chuyển chuột
              if (hoveredZoneId === shapeId) {
                const stage = e.target.getStage();
                if (stage) {
                  const position = stage.getPointerPosition();
                  if (position) {
                    setTooltipPosition({
                      x: position.x + 10,
                      y: position.y + 10
                    });
                  }
                }
              }
            }}
          >
            <Rect
              x={shape.x}
              y={shape.y}
              width={shape.width}
              height={shape.height}
              stroke={hoveredZoneId === shapeId ? "#1677ff" : strokeColor}
              strokeWidth={hoveredZoneId === shapeId ? 3 : strokeWidth}
              dash={[10, 5]}
              fill={hoveredZoneId === shapeId ? "rgba(24, 144, 255, 0.1)" : "transparent"}
            />
            
            {hasProgress && (
              <>
              <Rect
                x={shape.x + 5}
                y={shape.y + shape.height - 25}
                width={shape.width - 10}
                height={15}
                fill="#eee"
                cornerRadius={2}
              />
              <Rect
                x={shape.x + 5}
                y={shape.y + shape.height - 25}
                width={(shape.width - 10) * (overallProgress / 100)}
                height={15}
                fill={hasDelayed ? "#ff4d4f" : "#1677ff"}
                cornerRadius={2}
              />
              <KonvaText
                x={shape.x + 5}
                y={shape.y + shape.height - 45}
                text={`${progressItems.length} công việc (${overallProgress}%)`}
                fontSize={11}
                fill="#000"
              />
              </>
            )}
          </Group>
        );
      } else {
        // Render other shapes normally without progress indicators
        return (
          <Rect
            key={`shape-${index}`}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            fill={shape.fill}
            opacity={shape.opacity || 0.6}
            stroke="#ddd"
            strokeWidth={1}
          />
        );
      }
    });
  };

  const renderZoneProgress = () => {
    if (!progressByZone || Object.keys(progressByZone).length === 0) {
      return (
        <Empty
          description="Chưa có ranh giới nào được gán tiến độ"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return Object.entries(progressByZone).map(([zoneId, zoneProgress]) => {
      const zone = shapes.find((shape: any) => 
        shape.id.toString() === zoneId && shape.type === 'boundary'
      );
      if (!zone) return null;

      const overallProgress = Math.round(
        zoneProgress.reduce((sum, item) => sum + item.completionPercentage, 0) / zoneProgress.length
      );

      const hasDelayed = zoneProgress.some(item => item.status === 'delayed');
      const allCompleted = zoneProgress.every(item => item.status === 'completed');

      return (
        <Col span={12} key={zoneId} className="mb-4">
          <Card 
            size="small" 
            title={zone.name || `Ranh giới ${zoneId}`}
            className={hoveredZoneId === zoneId ? "border-primary border-2" : ""}
            onMouseEnter={() => setHoveredZoneId(zoneId)}
            onMouseLeave={() => setHoveredZoneId(null)}
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <Text>{zoneProgress.length} công việc </Text>
                <Text strong>{overallProgress}%</Text>
              </div>
              <AntProgress 
                percent={overallProgress} 
                status={hasDelayed ? 'exception' : (allCompleted ? 'success' : 'active')}
                size="small"
              />
            </div>
            
            <div className="mt-3">
              {zoneProgress.map(item => (
                <div key={item.id} className="flex justify-between items-center mb-1 text-sm">
                  <div className="truncate" style={{ maxWidth: '60%' }}>{item.name}</div>
                  <div className="flex items-center">
                    <AntProgress
                      percent={item.completionPercentage}
                      steps={5}
                      size="small"
                      strokeColor={item.status === 'delayed' ? '#ff4d4f' : '#1677ff'}
                      style={{ width: 60, marginRight: 8 }}
                    />
                    {item.status === 'delayed' && <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
                    {item.status === 'completed' && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    {item.status === 'in_progress' && <ClockCircleOutlined style={{ color: '#1677ff' }} />}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      );
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spin tip="Đang tải dữ liệu trực quan..." />
      </div>
    );
  }

  return (
    <div>
      <Row gutter={24}>
        <Col span={14}>
          <Card title="Trực quan hóa mặt bằng theo tiến độ">
            <div className="mb-3 text-sm text-gray-500">
              Các khu vực có tiến độ được hiển thị với màu tương ứng: xanh lá (hoàn thành), xanh dương (đang thực hiện), đỏ (bị trễ)
            </div>
            <div className="border rounded-md p-2 bg-gray-50 relative" style={{ overflow: 'auto' }}>
              <Stage width={stageWidth} height={stageHeight} scale={{ x: scale, y: scale }}>
                <Layer>
                  {renderShapes()}
                </Layer>
              </Stage>
              
              {/* Tooltip HTML hiển thị bên ngoài Canvas */}
              {tooltipPosition && (
                <div 
                  className="tooltip"
                  style={{
                    position: 'absolute',
                    left: tooltipPosition.x,
                    top: tooltipPosition.y,
                    background: 'white',
                    padding: '5px 10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    zIndex: 1000,
                    pointerEvents: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                >
                  {tooltipContent}
                </div>
              )}
            </div>
            <div className="mt-3 flex justify-end">
              <Button onClick={() => setScale(scale + 0.1)}>Phóng to</Button>
              <Button onClick={() => setScale(Math.max(0.5, scale - 0.1))} className="ml-2">Thu nhỏ</Button>
              <Button onClick={() => setScale(1)} className="ml-2">Khớp</Button>
            </div>
          </Card>
        </Col>
        <Col span={10}>
          <Card title="Tiến độ theo khu vực">
            <Row gutter={[16, 16]}>
              {renderZoneProgress()}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProgressVisualization;