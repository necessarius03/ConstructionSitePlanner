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
      const shapeId = shape.id.toString();
      const hasProgress = progressByZone[shapeId] && progressByZone[shapeId].length > 0;
      const progressItems = hasProgress ? progressByZone[shapeId] : [];
      
      // Calculate overall progress for this zone
      const overallProgress = progressItems.length > 0
        ? Math.round(progressItems.reduce((sum, item) => sum + item.completionPercentage, 0) / progressItems.length)
        : 0;
        
      // Check if zone has delayed tasks
      const hasDelayed = progressItems.some(item => item.status === 'delayed');
      
      // Determine zone color based on tasks
      let fillColor = shape.fill;
      let opacity = shape.opacity || 0.6;
      
      if (hasProgress) {
        if (hasDelayed) {
          fillColor = '#ffccc7'; // Light red for delayed
          opacity = 0.7;
        } else if (overallProgress === 100) {
          fillColor = '#d9f7be'; // Light green for completed
          opacity = 0.7;
        } else if (overallProgress > 0) {
          fillColor = '#bae7ff'; // Light blue for in progress
          opacity = 0.7;
        }
      }
      
      if (shape.type === 'boundary') {
        // Render boundary with dashed line
        return (
          <Group key={`shape-${index}`}>
            <Rect
              x={shape.x}
              y={shape.y}
              width={shape.width}
              height={shape.height}
              stroke="#000"
              strokeWidth={1.5}
              dash={[10, 5]}
              fill="transparent"
            />
            {shape.name && (
              <KonvaText
                x={shape.x + 15}
                y={shape.y + 15}
                text={shape.name}
                fontSize={14}
                fill="#000"
              />
            )}
          </Group>
        );
      } else if (shape.type === 'zone' || shape.type === 'material' || shape.type === 'storage') {
        // Render zone with progress info
        return (
          <Group key={`shape-${index}`}>
            <Rect
              x={shape.x}
              y={shape.y}
              width={shape.width}
              height={shape.height}
              fill={fillColor}
              opacity={opacity}
              stroke={hasProgress ? "#1677ff" : "#ddd"}
              strokeWidth={hasProgress ? 2 : 1}
              cornerRadius={3}
            />
            <KonvaText
              x={shape.x + 5}
              y={shape.y + 5}
              text={shape.name || `Khu vực ${index + 1}`}
              fontSize={12}
              fill="#000"
              width={shape.width - 10}
            />
            
            {hasProgress && (
              <>
                <Rect
                  x={shape.x + 5}
                  y={shape.y + shape.height - 15}
                  width={shape.width - 10}
                  height={10}
                  fill="#eee"
                  cornerRadius={2}
                />
                <Rect
                  x={shape.x + 5}
                  y={shape.y + shape.height - 15}
                  width={(shape.width - 10) * (overallProgress / 100)}
                  height={10}
                  fill={hasDelayed ? "#ff4d4f" : "#1677ff"}
                  cornerRadius={2}
                />
                <KonvaText
                  x={shape.x + 5}
                  y={shape.y + shape.height - 30}
                  text={`${progressItems.length} công việc (${overallProgress}%)`}
                  fontSize={11}
                  fill="#000"
                />
              </>
            )}
          </Group>
        );
      } else {
        // Render other shapes normally
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
          description="Chưa có khu vực nào được gán tiến độ"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return Object.entries(progressByZone).map(([zoneId, zoneProgress]) => {
      // Find corresponding shape for this zone
      const zone = shapes.find((shape: any) => shape.id.toString() === zoneId);
      if (!zone) return null;

      // Calculate overall progress
      const overallProgress = Math.round(
        zoneProgress.reduce((sum, item) => sum + item.completionPercentage, 0) / zoneProgress.length
      );

      // Check status
      const hasDelayed = zoneProgress.some(item => item.status === 'delayed');
      const allCompleted = zoneProgress.every(item => item.status === 'completed');

      return (
        <Col span={12} key={zoneId} className="mb-4">
          <Card size="small" title={zone.name || `Khu vực ${zoneId}`}>
            <div>
              <div className="flex justify-between items-center mb-2">
                <Text>{zoneProgress.length} công việc</Text>
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
            <div className="border rounded-md p-2 bg-gray-50" style={{ overflow: 'auto' }}>
              <Stage width={stageWidth} height={stageHeight} scale={{ x: scale, y: scale }}>
                <Layer>
                  {renderShapes()}
                </Layer>
              </Stage>
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