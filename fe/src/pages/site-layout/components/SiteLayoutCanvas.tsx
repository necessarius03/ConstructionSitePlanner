// src/pages/site-layout/components/SiteLayoutCanvas.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Transformer, Text, Group } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import type { Transformer as KonvaTransformer } from 'konva/lib/shapes/Transformer';
import type { Stage as KonvaStage } from 'konva/lib/Stage';
import {
  Shape,
  ShapeType,
  CanvasGridProps,
  DraggableRectProps,
  SiteLayoutCanvasProps,
  Equipment
} from '../types';
import CanvasToolbar from './CanvasToolbar';
import { ShapeProperties } from './ShapeProperties';
import EquipmentSelectionModal from './EquipmentSelectionModal';

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

const ShapeComponent: React.FC<DraggableRectProps> = ({ 
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
      <Group>
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
        
        {/* Hiển thị icon nếu là thiết bị */}
        {shapeProps.type === 'equipment' && shapeProps.icon && (
          <Text
            x={shapeProps.x + shapeProps.width / 2 - 10}
            y={shapeProps.y + shapeProps.height / 2 - 10}
            text={shapeProps.icon}
            fontSize={20}
            align="center"
            verticalAlign="middle"
          />
        )}
        
        {/* Hiển thị tên */}
        {shapeProps.name && (
          <Text
            x={shapeProps.x}
            y={shapeProps.y - 20}
            text={shapeProps.name}
            fontSize={12}
            fill="#333"
          />
        )}
      </Group>
      
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
  const [equipmentModalVisible, setEquipmentModalVisible] = useState(false);
  const stageRef = useRef<KonvaStage>(null);

  const handleShapesChange = (newShapes: Shape[]) => {
    setShapes(newShapes);
    onShapesChange?.(newShapes);
  };

  const checkDeselect = (e: KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
      onSelectShape?.(null);
    }
  };

  const addShape = (type: ShapeType) => {
    if (type === 'equipment') {
      setEquipmentModalVisible(true);
      return;
    }
    
    const newShape: Shape = {
      id: Date.now(),
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      fill: getDefaultColor(type),
      opacity: 0.6,
      type,
      isSelected: false,
      name: `New ${type}`,
      rotation: 0
    };
    handleShapesChange([...shapes, newShape]);
  };
  
  const addEquipment = (equipment: Equipment) => {
    const newShape: Shape = {
      id: Date.now(),
      x: 100,
      y: 100,
      width: equipment.width,
      height: equipment.height,
      fill: equipment.color,
      opacity: 0.7,
      type: 'equipment',
      isSelected: false,
      name: equipment.name,
      rotation: 0,
      equipmentId: equipment.id,
      icon: equipment.icon
    };
    handleShapesChange([...shapes, newShape]);
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
  
  // Lấy màu mặc định cho từng loại hình
  const getDefaultColor = (type: ShapeType): string => {
    const colorMap: Record<ShapeType, string> = {
      equipment: '#0066ff',
      material: '#e67e22',
      zone: '#27ae60',
      storage: '#8e44ad',
      path: '#e74c3c'
    };
    return colorMap[type];
  };

  return (
    <div className="flex flex-col h-full">
      <CanvasToolbar 
        onAddShape={addShape}
        onUndo={() => {}}
        onRedo={() => {}}
        canUndo={false}
        canRedo={false}
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
              {shapes.map((shape) => (
                <ShapeComponent
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
              ))}
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
      <EquipmentSelectionModal
        visible={equipmentModalVisible}
        onClose={() => setEquipmentModalVisible(false)}
        onSelectEquipment={(equipment) => {
          addEquipment(equipment);
          setEquipmentModalVisible(false);
        }}
      />
    </div>
  );
};

export default SiteLayoutCanvas;