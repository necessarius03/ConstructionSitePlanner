// src/pages/site-layout/components/SiteLayoutCanvas.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Transformer } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import type { Transformer as KonvaTransformer } from 'konva/lib/shapes/Transformer';
import type { Stage as KonvaStage } from 'konva/lib/Stage';
import {
  Shape,
  ShapeType,
  CanvasGridProps,
  DraggableRectProps,
  SiteLayoutCanvasProps
} from '../types';
import { CanvasToolbar } from './CanvasToolbar';
import { ShapeProperties } from './ShapeProperties';
import EquipmentSelectModal from './EquipmentSelectModal';
import { Equipment } from '../../../data/equipment-data';
import EquipmentIconShape from './EquipmentIconShape';

const GRID_SIZE = 20;

const CanvasGrid: React.FC<CanvasGridProps> = ({ 
  width, 
  height, 
  gridSize = GRID_SIZE,
  color = '#ddd',
  opacity = 0.5 
}) => {
  const gridComponents = [];
  
  // Create vertical lines
  for (let i = 0; i <= width; i += gridSize) {
    gridComponents.push(
      <Rect
        key={`v${i}`}
        x={i}
        y={0}
        width={1}
        height={height}
        fill={color}
        opacity={opacity}
      />
    );
  }
  
  // Create horizontal lines
  for (let i = 0; i <= height; i += gridSize) {
    gridComponents.push(
      <Rect
        key={`h${i}`}
        x={0}
        y={i}
        width={width}
        height={1}
        fill={color}
        opacity={opacity}
      />
    );
  }
  
  return <>{gridComponents}</>;
};

const DraggableRect: React.FC<DraggableRectProps> = ({ 
  shapeProps, 
  isLocked = false,
  onSelect, 
  onChange,
  onContextMenu 
}) => {
  const shapeRef = useRef<KonvaRect>(null);
  const transformerRef = useRef<KonvaTransformer>(null);

  useEffect(() => {
    if (shapeProps.isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [shapeProps.isSelected]);

  const { id, ...otherShapeProps } = shapeProps;
  const rectProps = {
    ...otherShapeProps,
    id: id.toString()
  };

  return (
    <>
      <Rect
        {...rectProps}
        ref={shapeRef}
        draggable={!isLocked}
        onClick={onSelect}
        onTap={onSelect}
        onContextMenu={onContextMenu}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          if (!shapeRef.current) return;
          
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          const rotation = node.rotation();

          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            rotation: rotation,
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
          });
        }}
      />
      {shapeProps.isSelected && !isLocked && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            const minWidth = 5;
            const minHeight = 5;
            const maxWidth = 800;
            const maxHeight = 600;
            
            if (
              newBox.width < minWidth ||
              newBox.height < minHeight ||
              newBox.width > maxWidth ||
              newBox.height > maxHeight
            ) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

const SiteLayoutCanvas: React.FC<SiteLayoutCanvasProps> = ({
  initialShapes = [],
  isReadOnly = false,
  gridSize = GRID_SIZE,
  onShapesChange,
  onSelectShape
}) => {
  const [shapes, setShapes] = useState<Shape[]>(initialShapes);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEquipmentModalVisible, setIsEquipmentModalVisible] = useState(false);
  const stageRef = useRef<KonvaStage>(null);
  
  // Lịch sử thao tác để hỗ trợ undo/redo
  const [history, setHistory] = useState<Shape[][]>([initialShapes]);
  const [historyStep, setHistoryStep] = useState(0);
  
  // Đồng bộ shapes ban đầu
  useEffect(() => {
    if (initialShapes.length > 0 && shapes.length === 0) {
      setShapes(initialShapes);
      setHistory([initialShapes]);
    }
  }, [initialShapes]);

  const handleShapesChange = (newShapes: Shape[]) => {
    // Cập nhật shapes
    setShapes(newShapes);
    
    // Cập nhật lịch sử nếu là thao tác mới
    if (historyStep < history.length - 1) {
      // Cắt bỏ phần lịch sử phía sau vị trí hiện tại
      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push([...newShapes]);
      setHistory(newHistory);
      setHistoryStep(newHistory.length - 1);
    } else {
      // Thêm trạng thái mới vào lịch sử
      setHistory([...history, [...newShapes]]);
      setHistoryStep(history.length);
    }
    
    // Gọi callback nếu có
    onShapesChange?.(newShapes);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      setShapes([...history[newStep]]);
      onShapesChange?.([...history[newStep]]);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      setShapes([...history[newStep]]);
      onShapesChange?.([...history[newStep]]);
    }
  };

  const checkDeselect = (e: KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
      onSelectShape?.(null);
    }
  };

  const addShape = (type: ShapeType) => {
    // Khi thêm các loại hình khác thiết bị
    if (type !== 'equipment') {
      const newShape: Shape = {
        id: Date.now(),
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        fill: getShapeColor(type),
        opacity: 0.6,
        type,
        isSelected: false,
        name: getShapeName(type),
        rotation: 0
      };
      handleShapesChange([...shapes, newShape]);
    }
  };

  const getShapeName = (type: ShapeType): string => {
    switch (type) {
      case 'equipment': return 'Thiết bị mới';
      case 'material': return 'Vật liệu mới';
      case 'zone': return 'Khu vực mới';
      case 'storage': return 'Kho chứa mới';
      case 'path': return 'Đường đi mới';
      default: return 'Đối tượng mới';
    }
  };

  const getShapeColor = (type: ShapeType): string => {
    switch (type) {
      case 'equipment': return '#0066ff';
      case 'material': return '#ffc107';
      case 'zone': return '#4caf50';
      case 'storage': return '#9c27b0';
      case 'path': return '#ff5722';
      default: return '#0066ff';
    }
  };

  const updateShape = (updatedShape: Shape) => {
    const newShapes = shapes.map(shape => 
      shape.id === updatedShape.id ? updatedShape : shape
    );
    handleShapesChange(newShapes);
  };

  const deleteShape = (shapeId: number) => {
    handleShapesChange(shapes.filter(shape => shape.id !== shapeId));
    setSelectedId(null);
    onSelectShape?.(null);
  };

  const handleEquipmentSelect = (equipment: Equipment) => {
    // Tạo một shape mới với thông tin từ thiết bị đã chọn
    const newShape: Shape = {
      id: Date.now(),
      x: 100,
      y: 100,
      width: equipment.width,
      height: equipment.height,
      fill: equipment.color,
      opacity: 0.8,
      type: 'equipment',
      isSelected: false,
      name: equipment.name,
      equipmentId: equipment.id,
      iconComponent: equipment.icon,
      rotation: 0
    };
    
    handleShapesChange([...shapes, newShape]);
    setIsEquipmentModalVisible(false);
  };

  // Xử lý thay đổi kích thước cửa sổ
  useEffect(() => {
    const handleResize = () => {
      if (stageRef.current) {
        stageRef.current.width(window.innerWidth - 350);
        stageRef.current.height(window.innerHeight - 200);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <CanvasToolbar 
        onAddShape={addShape}
        onShowEquipmentModal={() => setIsEquipmentModalVisible(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyStep > 0}
        canRedo={historyStep < history.length - 1}
      />
      <div className="flex gap-4 h-full">
        <div className="flex-1 relative border rounded-lg bg-white">
          <Stage
            ref={stageRef}
            width={window.innerWidth - 350}
            height={window.innerHeight - 200}
            onClick={checkDeselect}
            onTap={checkDeselect as unknown as (e: KonvaEventObject<TouchEvent>) => void}
          >
            <Layer>
              <CanvasGrid 
                width={window.innerWidth - 350} 
                height={window.innerHeight - 200}
                gridSize={gridSize}
              />
              {shapes.map((shape) => {
                // Nếu là thiết bị, sử dụng component EquipmentIconShape
                if (shape.type === 'equipment' && shape.iconComponent) {
                  return (
                    <EquipmentIconShape
                      key={shape.id}
                      shape={shape}
                      isSelected={shape.id === selectedId}
                      isLocked={isReadOnly}
                      onSelect={() => {
                        setSelectedId(shape.id);
                        onSelectShape?.(shape);
                      }}
                      onChange={updateShape}
                    />
                  );
                }
                
                // Các loại hình khác thì sử dụng DraggableRect
                return (
                  <DraggableRect
                    key={shape.id}
                    shapeProps={{
                      ...shape,
                      isSelected: shape.id === selectedId,
                    }}
                    isLocked={isReadOnly}
                    onSelect={() => {
                      setSelectedId(shape.id);
                      onSelectShape?.(shape);
                    }}
                    onChange={updateShape}
                  />
                );
              })}
            </Layer>
          </Stage>
        </div>
        {selectedId && (
          <ShapeProperties
            shape={shapes.find(s => s.id === selectedId) || null}
            onUpdate={updateShape}
            onDelete={deleteShape}
          />
        )}
      </div>
      
      {/* Modal chọn thiết bị */}
      <EquipmentSelectModal
        visible={isEquipmentModalVisible}
        onCancel={() => setIsEquipmentModalVisible(false)}
        onSelect={handleEquipmentSelect}
      />
    </div>
  );
};

export default SiteLayoutCanvas;