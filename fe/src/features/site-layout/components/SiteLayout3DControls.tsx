// fe/src/features/site-layout/components/SiteLayout3DControls.tsx
import React, { useState } from 'react';
import { Card, Switch, Slider, Button, Space, Tooltip, Divider, Select, Badge } from 'antd';
import { 
  EyeOutlined,
  EyeInvisibleOutlined,
  SettingOutlined,
  VideoCameraOutlined,
  CameraOutlined,
  FullscreenOutlined,
  InfoCircleOutlined,
  ExportOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons';
import { Shape } from '../types';

const { Option } = Select;

interface SiteLayout3DControlsProps {
  viewMode: 'overview' | 'equipment' | 'progress' | 'safety';
  onViewModeChange: (mode: 'overview' | 'equipment' | 'progress' | 'safety') => void;
  selectedShape: Shape | null;
  onToggleGrid: () => void;
  onToggleSky: () => void;
  showGrid: boolean;
  showSky: boolean;
}

const SiteLayout3DControls: React.FC<SiteLayout3DControlsProps> = ({
  viewMode,
  onViewModeChange,
  selectedShape,
  onToggleGrid,
  onToggleSky,
  showGrid,
  showSky
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [showFlowAnimation, setShowFlowAnimation] = useState(true);
  const [renderQuality, setRenderQuality] = useState<'low' | 'medium' | 'high'>('medium');

  const handleExport3D = () => {
    // TODO: Implement 3D export functionality
    console.log('Exporting 3D model...');
  };

  const handleTakeScreenshot = () => {
    // TODO: Implement screenshot functionality
    console.log('Taking screenshot...');
  };

  const handleStartRecording = () => {
    // TODO: Implement recording functionality
    console.log('Starting recording...');
  };

  const handleEnterVR = () => {
    // TODO: Implement VR mode
    console.log('Entering VR mode...');
  };

  const viewModeOptions = [
    { value: 'overview', label: 'Tổng quan', color: '#1890ff' },
    { value: 'equipment', label: 'Thiết bị', color: '#52c41a' },
    { value: 'progress', label: 'Tiến độ', color: '#faad14' },
    { value: 'safety', label: 'An toàn', color: '#f5222d' }
  ];

  const qualityOptions = [
    { value: 'low', label: 'Thấp', description: 'Hiệu suất cao' },
    { value: 'medium', label: 'Trung bình', description: 'Cân bằng' },
    { value: 'high', label: 'Cao', description: 'Chất lượng tốt nhất' }
  ];

  return (
    <div className="absolute bottom-4 left-4 z-10">
      <Card 
        size="small" 
        className="shadow-lg"
        style={{ width: isExpanded ? 320 : 200 }}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Điều khiển 3D</span>
          <Button 
            type="text" 
            size="small"
            icon={<SettingOutlined />}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>

        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {/* View Mode Selection */}
          <div>
            <label className="text-xs text-gray-600 block mb-1">Chế độ xem</label>
            <Select
              value={viewMode}
              onChange={onViewModeChange}
              size="small"
              style={{ width: '100%' }}
            >
              {viewModeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  <Badge color={option.color} text={option.label} />
                </Option>
              ))}
            </Select>
          </div>

          {/* Basic Display Controls */}
          <div>
            <Space wrap>
              <Tooltip title={showGrid ? "Ẩn lưới" : "Hiện lưới"}>
                <Button
                  size="small"
                  type={showGrid ? "primary" : "default"}
                  icon={showGrid ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  onClick={onToggleGrid}
                >
                  Lưới
                </Button>
              </Tooltip>
              
              <Tooltip title={showSky ? "Ẩn bầu trời" : "Hiện bầu trời"}>
                <Button
                  size="small"
                  type={showSky ? "primary" : "default"}
                  icon={showSky ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  onClick={onToggleSky}
                >
                  Trời
                </Button>
              </Tooltip>
            </Space>
          </div>

          {/* Expanded Controls */}
          {isExpanded && (
            <>
              <Divider style={{ margin: '8px 0' }} />
              
              {/* Animation Controls */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">Animation</label>
                <Space>
                  <Button
                    size="small"
                    type={isAnimationPlaying ? "primary" : "default"}
                    icon={isAnimationPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                    onClick={() => setIsAnimationPlaying(!isAnimationPlaying)}
                  />
                  <span className="text-xs">Tốc độ:</span>
                  <Slider
                    min={0.1}
                    max={3}
                    step={0.1}
                    value={animationSpeed}
                    onChange={setAnimationSpeed}
                    style={{ width: 80 }}
                  />
                </Space>
              </div>

              {/* Display Options */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">Hiển thị</label>
                <Space direction="vertical" size="small">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Nhãn</span>
                    <Switch 
                      size="small" 
                      checked={showLabels} 
                      onChange={setShowLabels} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Kích thước</span>
                    <Switch 
                      size="small" 
                      checked={showMeasurements} 
                      onChange={setShowMeasurements} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Luồng di chuyển</span>
                    <Switch 
                      size="small" 
                      checked={showFlowAnimation} 
                      onChange={setShowFlowAnimation} 
                    />
                  </div>
                </Space>
              </div>

              {/* Render Quality */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">Chất lượng</label>
                <Select
                  value={renderQuality}
                  onChange={setRenderQuality}
                  size="small"
                  style={{ width: '100%' }}
                >
                  {qualityOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      <div>
                        <div>{option.label}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </div>

              <Divider style={{ margin: '8px 0' }} />

              {/* Export & Capture Controls */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">Xuất & Chụp</label>
                <Space wrap>
                  <Tooltip title="Chụp ảnh màn hình">
                    <Button
                      size="small"
                      icon={<CameraOutlined />}
                      onClick={handleTakeScreenshot}
                    />
                  </Tooltip>
                  
                  <Tooltip title="Quay video">
                    <Button
                      size="small"
                      icon={<VideoCameraOutlined />}
                      onClick={handleStartRecording}
                    />
                  </Tooltip>
                  
                  <Tooltip title="Xuất mô hình 3D">
                    <Button
                      size="small"
                      icon={<ExportOutlined />}
                      onClick={handleExport3D}
                    />
                  </Tooltip>
                  
                  <Tooltip title="Chế độ VR">
                    <Button
                      size="small"
                      icon={<FullscreenOutlined />}
                      onClick={handleEnterVR}
                    />
                  </Tooltip>
                </Space>
              </div>
            </>
          )}

          {/* Selected Object Info */}
          {selectedShape && (
            <>
              <Divider style={{ margin: '8px 0' }} />
              <div>
                <div className="flex items-center mb-1">
                  <InfoCircleOutlined className="text-blue-500 mr-1" />
                  <span className="text-xs font-medium">Đối tượng đã chọn</span>
                </div>
                <div className="text-xs">
                  <div><strong>Tên:</strong> {selectedShape.name || 'Không có tên'}</div>
                  <div><strong>Loại:</strong> {selectedShape.type}</div>
                  <div><strong>Kích thước:</strong> {Math.round(selectedShape.width)} × {Math.round(selectedShape.height)}</div>
                  {selectedShape.notes && (
                    <div><strong>Ghi chú:</strong> {selectedShape.notes}</div>
                  )}
                </div>
              </div>
            </>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default SiteLayout3DControls;