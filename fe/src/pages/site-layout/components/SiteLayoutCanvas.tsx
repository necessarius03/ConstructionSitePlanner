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
const PROPERTIES_PANEL_WIDTH = 280; // Giảm chiều rộng panel thuộc tính

const CanvasGrid: React.FC<CanvasGridProps> = ({ 
  width, 
  height, 
  gridSize = GRID_SIZE,
  color = '#ddd',
  opacity = 0.5 
}) => {
  const gridComponents = [];
  
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
  
  const [history, setHistory] = useState<Shape[][]>([initialShapes]);
  const [historyStep, setHistoryStep] = useState(0);
  
  // Tính toán kích thước canvas dựa trên kích thước cửa sổ và panel thuộc tính
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth - 350);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight - 200);
  
  // Xử lý phím Delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedId) {
        deleteShape(selectedId);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedId]);

  // Cập nhật kích thước canvas khi cửa sổ thay đổi kích thước
  useEffect(() => {
    const handleResize = () => {
      // Tính toán lại kích thước canvas khi có panel thuộc tính
      const propertiesPanelWidth = selectedId ? PROPERTIES_PANEL_WIDTH : 0;
      const newWidth = window.innerWidth - 350 - propertiesPanelWidth;
      const newHeight = window.innerHeight - 200;
      
      setCanvasWidth(newWidth);
      setCanvasHeight(newHeight);
      
      if (stageRef.current) {
        stageRef.current.width(newWidth);
        stageRef.current.height(newHeight);
      }
    };

    handleResize(); // Gọi ngay khi component mount hoặc selectedId thay đổi
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [selectedId]);

  useEffect(() => {
    setShapes(initialShapes);
    setHistory([initialShapes]);
    setHistoryStep(0);
    setSelectedId(null);
  }, [initialShapes]);

  const handleShapesChange = (newShapes: Shape[]) => {
    setShapes(newShapes);
    
    if (historyStep < history.length - 1) {
      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push([...newShapes]);
      setHistory(newHistory);
      setHistoryStep(newHistory.length - 1);
    } else {
      setHistory([...history, [...newShapes]]);
      setHistoryStep(history.length);
    }
    
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
    const filteredShapes = shapes.filter(shape => shape.id !== shapeId);
    handleShapesChange(filteredShapes);
    
    if (selectedId === shapeId) {
      setSelectedId(null);
      onSelectShape?.(null);
    }
  };

  const handleEquipmentSelect = (equipment: Equipment) => {
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

  return (
    <div className="h-full" style={{ display: 'flex', flexDirection: 'column' }}>
      <CanvasToolbar 
        onAddShape={addShape}
        onShowEquipmentModal={() => setIsEquipmentModalVisible(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyStep > 0}
        canRedo={historyStep < history.length - 1}
      />
      
      {/* Sử dụng display: flex và flexDirection: row để đảm bảo nó hiển thị ngang */}
      <div className="h-full" style={{ display: 'flex', flexDirection: 'row' }}>
        <div className="relative border rounded-lg bg-white" style={{ flex: 1 }}>
          <Stage
            ref={stageRef}
            width={canvasWidth}
            height={canvasHeight}
            onClick={checkDeselect}
            onTap={checkDeselect as unknown as (e: KonvaEventObject<TouchEvent>) => void}
          >
            <Layer>
              <CanvasGrid 
                width={canvasWidth} 
                height={canvasHeight}
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
        
        {/* Panel thuộc tính bên phải với chiều rộng cố định */}
        {selectedId && (
          <div 
            className="border-l bg-white" 
            style={{ 
              width: `${PROPERTIES_PANEL_WIDTH}px`,
              overflowY: 'auto',
              overflowX: 'hidden'
            }}
          >
            <ShapeProperties
              shape={shapes.find(s => s.id === selectedId) || null}
              onUpdate={updateShape}
              onDelete={deleteShape}
            />
          </div>
        )}
      </div>
      
      <EquipmentSelectModal
        visible={isEquipmentModalVisible}
        onCancel={() => setIsEquipmentModalVisible(false)}
        onSelect={handleEquipmentSelect}
      />
    </div>
  );
};

export default SiteLayoutCanvas;