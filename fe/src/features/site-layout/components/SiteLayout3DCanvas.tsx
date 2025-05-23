// fe/src/features/site-layout/components/SiteLayout3DCanvas.tsx
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Sky, Environment, PerspectiveCamera } from '@react-three/drei';
import { Button, Space, Select, Tooltip, Card, Spin } from 'antd';
import { 
  ZoomInOutlined, 
  ZoomOutOutlined, 
  FullscreenOutlined,
  EyeOutlined,
  CameraOutlined,
  SettingOutlined 
} from '@ant-design/icons';
import * as THREE from 'three';
import { Shape } from '../types';
import Equipment3D from './Equipment3D';
import Boundary3D from './Boundary3D';
import TransportFlow3D from './TransportFlow3D';
import ProgressZone3D from './ProgressZone3D';
import SiteLayout3DControls from './SiteLayout3DControls';
import { Progress } from '../../../services/ProgressService';

const { Option } = Select;

interface SiteLayout3DCanvasProps {
  initialShapes?: Shape[];
  progress?: Progress[];
  isReadOnly?: boolean;
  onShapesChange?: (shapes: Shape[]) => void;
  onSelectShape?: (shape: Shape | null) => void;
}

const SiteLayout3DCanvas: React.FC<SiteLayout3DCanvasProps> = ({
  initialShapes = [],
  progress = [],
  isReadOnly = false,
  onShapesChange,
  onSelectShape
}) => {
  const [shapes, setShapes] = useState<Shape[]>(initialShapes);
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'equipment' | 'progress' | 'safety'>('overview');
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([50, 50, 50]);
  const [showGrid, setShowGrid] = useState(true);
  const [showSky, setShowSky] = useState(true);
  const [lighting, setLighting] = useState<'day' | 'night' | 'sunset'>('day');
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShapes(initialShapes);
  }, [initialShapes]);

  const handleShapeSelect = (shape: Shape | null) => {
    setSelectedShape(shape);
    onSelectShape?.(shape);
  };

  const handleShapeUpdate = (updatedShape: Shape) => {
    const newShapes = shapes.map(shape => 
      shape.id === updatedShape.id ? updatedShape : shape
    );
    setShapes(newShapes);
    onShapesChange?.(newShapes);
  };

  const resetCamera = () => {
    setCameraPosition([50, 50, 50]);
  };

  const changeCameraView = (view: 'top' | 'front' | 'side' | 'iso') => {
    switch (view) {
      case 'top':
        setCameraPosition([0, 100, 0]);
        break;
      case 'front':
        setCameraPosition([0, 10, 100]);
        break;
      case 'side':
        setCameraPosition([100, 10, 0]);
        break;
      case 'iso':
        setCameraPosition([50, 50, 50]);
        break;
    }
  };

  const exportScene = () => {
    // TODO: Implement 3D model export functionality
    console.log('Exporting 3D scene...');
  };

  const getLightingConfig = () => {
    switch (lighting) {
      case 'day':
        return {
          ambientIntensity: 0.6,
          sunPosition: [100, 100, 50],
          sunIntensity: 1.0,
          skyTurbidity: 2,
          skyRayleigh: 0.5
        };
      case 'night':
        return {
          ambientIntensity: 0.1,
          sunPosition: [0, -50, 0],
          sunIntensity: 0.1,
          skyTurbidity: 10,
          skyRayleigh: 2
        };
      case 'sunset':
        return {
          ambientIntensity: 0.4,
          sunPosition: [100, 10, 50],
          sunIntensity: 0.8,
          skyTurbidity: 8,
          skyRayleigh: 1.5
        };
      default:
        return {
          ambientIntensity: 0.6,
          sunPosition: [100, 100, 50],
          sunIntensity: 1.0,
          skyTurbidity: 2,
          skyRayleigh: 0.5
        };
    }
  };

  const lightConfig = getLightingConfig();

  // Filter shapes by boundary and equipment
  const boundaryShapes = shapes.filter(shape => shape.type === 'boundary');
  const equipmentShapes = shapes.filter(shape => shape.type === 'equipment');
  const otherShapes = shapes.filter(shape => 
    shape.type !== 'boundary' && shape.type !== 'equipment'
  );

  return (
    <div className="h-full relative" ref={canvasRef}>
      {/* 3D Controls Panel */}
      <div className="absolute top-4 right-4 z-10">
        <Card size="small" className="shadow-lg">
          <Space direction="vertical" size="small">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Chế độ xem</label>
              <Select 
                value={viewMode} 
                onChange={setViewMode}
                size="small"
                style={{ width: 120 }}
              >
                <Option value="overview">Tổng quan</Option>
                <Option value="equipment">Thiết bị</Option>
                <Option value="progress">Tiến độ</Option>
                <Option value="safety">An toàn</Option>
              </Select>
            </div>
            
            <div>
              <label className="text-xs text-gray-600 block mb-1">Ánh sáng</label>
              <Select 
                value={lighting} 
                onChange={setLighting}
                size="small"
                style={{ width: 120 }}
              >
                <Option value="day">Ban ngày</Option>
                <Option value="sunset">Hoàng hôn</Option>
                <Option value="night">Ban đêm</Option>
              </Select>
            </div>

            {/* <Space wrap>
              <Tooltip title="Góc nhìn từ trên">
                <Button 
                  size="small" 
                  onClick={() => changeCameraView('top')}
                  icon={<EyeOutlined />}
                >
                  Top
                </Button>
              </Tooltip>
              <Tooltip title="Góc nhìn phía trước">
                <Button 
                  size="small" 
                  onClick={() => changeCameraView('front')}
                  icon={<CameraOutlined />}
                >
                  Front
                </Button>
              </Tooltip>
              <Tooltip title="Góc nhìn bên">
                <Button 
                  size="small" 
                  onClick={() => changeCameraView('side')}
                  icon={<CameraOutlined />}
                >
                  Side
                </Button>
              </Tooltip>
              <Tooltip title="Góc nhìn đẳng cự">
                <Button 
                  size="small" 
                  onClick={() => changeCameraView('iso')}
                  icon={<FullscreenOutlined />}
                >
                  ISO
                </Button>
              </Tooltip>
            </Space> */}

            <Button 
              size="small" 
              onClick={exportScene}
              icon={<SettingOutlined />}
              block
            >
              Xuất 3D
            </Button>
          </Space>
        </Card>
      </div>

      {/* Main 3D Canvas */}
      <Canvas
        shadows
        camera={{ 
          position: cameraPosition, 
          fov: 60,
          near: 0.1,
          far: 2000
        }}
        style={{ 
          height: 'calc(80vh - 100px)',
          width: '100%',
          position: 'absolute',
          top: '80px',
          left: 0
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={lightConfig.ambientIntensity} />
          <directionalLight 
            position={lightConfig.sunPosition}
            intensity={lightConfig.sunIntensity}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={500}
            shadow-camera-left={-200}
            shadow-camera-right={200}
            shadow-camera-top={200}
            shadow-camera-bottom={-200}
          />

          {/* Environment */}
          {showSky && (
            <Sky
              distance={450000}
              sunPosition={lightConfig.sunPosition}
              inclination={0}
              azimuth={0.25}
              turbidity={lightConfig.skyTurbidity}
              rayleigh={lightConfig.skyRayleigh}
            />
          )}

          {/* Grid */}
          {showGrid && (
            <Grid 
              args={[200, 200]} 
              cellSize={5} 
              cellThickness={0.5} 
              cellColor="#6e6e6e" 
              sectionSize={25} 
              sectionThickness={1} 
              sectionColor="#4a4a4a"
              fadeDistance={400}
              fadeStrength={1}
            />
          )}

          {/* Ground Plane */}
          <mesh receiveShadow position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1000, 1000]} />
            <meshLambertMaterial color="#8fac7e" />
          </mesh>

          {/* Render Boundaries */}
          {boundaryShapes.map(shape => (
            <Boundary3D
              key={shape.id}
              shape={shape}
              isSelected={selectedShape?.id === shape.id}
              onSelect={() => handleShapeSelect(shape)}
              onUpdate={handleShapeUpdate}
              progress={progress}
              viewMode={viewMode}
            />
          ))}

          {/* Render Equipment */}
          {equipmentShapes.map(shape => (
            <Equipment3D
              key={shape.id}
              shape={shape}
              isSelected={selectedShape?.id === shape.id}
              onSelect={() => handleShapeSelect(shape)}
              onUpdate={handleShapeUpdate}
              viewMode={viewMode}
            />
          ))}

          {/* Render Other Shapes (zones, storage, etc.) */}
          {otherShapes.map(shape => (
            <ProgressZone3D
              key={shape.id}
              shape={shape}
              isSelected={selectedShape?.id === shape.id}
              onSelect={() => handleShapeSelect(shape)}
              onUpdate={handleShapeUpdate}
              progress={progress.find(p => p.zoneShapeId === shape.id.toString())}
              viewMode={viewMode}
            />
          ))}

          {/* Transport Flow Visualization */}
          {viewMode === 'overview' && (
            <TransportFlow3D 
              shapes={shapes}
              progress={progress}
            />
          )}

          {/* Camera Controls */}
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            minDistance={10}
            maxDistance={500}
            maxPolarAngle={Math.PI / 2}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>

      {/* Loading Spinner */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
          <Spin size="large" tip="Đang tải mô hình 3D..." />
        </div>
      }>
        <div />
      </Suspense>

      {/* Additional Controls */}
      <SiteLayout3DControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedShape={selectedShape}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onToggleSky={() => setShowSky(!showSky)}
        showGrid={showGrid}
        showSky={showSky}
      />
    </div>
  );
};

export default SiteLayout3DCanvas;