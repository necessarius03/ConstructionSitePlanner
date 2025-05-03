import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import ShapePropertiesModal from './ShapePropertiesModal';
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
  // Basic state
  const [shapes, setShapes] = useState<Shape[]>(initialShapes);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isPropertiesModalVisible, setIsPropertiesModalVisible] = useState(false);
  const [isEquipmentModalVisible, setIsEquipmentModalVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // References
  const stageRef = useRef<KonvaStage>(null);
  
  // History state for undo/redo
  const [history, setHistory] = useState<Shape[][]>([initialShapes]);
  const [historyStep, setHistoryStep] = useState(0);
  
  // Canvas dimensions
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth - 350);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight - 200);
  
  // Reset states when initialShapes changes (e.g., loading a new layout)
  useEffect(() => {
    setShapes(initialShapes);
    setHistory([initialShapes]);
    setHistoryStep(0);
    setSelectedId(null);
    setIsPropertiesModalVisible(false);
  }, [initialShapes]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        
        setCanvasWidth(containerWidth);
        setCanvasHeight(containerHeight);
        
        if (stageRef.current) {
          stageRef.current.width(containerWidth);
          stageRef.current.height(containerHeight);
        }
      }
    };

    // Initial calculation
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete the selected shape when pressing Delete key
      if (e.key === 'Delete' && selectedId) {
        deleteShape(selectedId);
      }
      
      // Open properties modal when pressing Enter on a selected shape
      if (e.key === 'Enter' && selectedId) {
        setIsPropertiesModalVisible(true);
      }
      
      // Close properties modal when pressing Escape
      if (e.key === 'Escape') {
        setIsPropertiesModalVisible(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedId]);
  
  // Handle shapes change with history tracking
  const handleShapesChange = useCallback((newShapes: Shape[]) => {
    setShapes(newShapes);
    
    // Update history for undo/redo
    if (historyStep < history.length - 1) {
      // If we're in the middle of the history, truncate it
      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push([...newShapes]);
      setHistory(newHistory);
      setHistoryStep(newHistory.length - 1);
    } else {
      // Just add to the end of history
      setHistory(prev => [...prev, [...newShapes]]);
      setHistoryStep(history.length);
    }
    
    // Notify parent component
    if (onShapesChange) {
      onShapesChange(newShapes);
    }
  }, [history, historyStep, onShapesChange]);
  
  // Undo/redo functions
  const handleUndo = useCallback(() => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      const updatedShapes = [...history[newStep]];
      setShapes(updatedShapes);
      
      if (onShapesChange) {
        onShapesChange(updatedShapes);
      }
    }
  }, [history, historyStep, onShapesChange]);

  const handleRedo = useCallback(() => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      const updatedShapes = [...history[newStep]];
      setShapes(updatedShapes);
      
      if (onShapesChange) {
        onShapesChange(updatedShapes);
      }
    }
  }, [history, historyStep, onShapesChange]);
  
  // Handle shape selection
  const checkDeselect = (e: KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
      onSelectShape?.(null);
    }
  };
  
  // Create a new shape
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
  
  // Helper functions for shape creation
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
  
  // Handle shape modifications
  const updateShape = useCallback((updatedShape: Shape) => {
    const newShapes = shapes.map(shape => 
      shape.id === updatedShape.id ? updatedShape : shape
    );
    handleShapesChange(newShapes);
  }, [shapes, handleShapesChange]);

  const deleteShape = useCallback((shapeId: number) => {
    const filteredShapes = shapes.filter(shape => shape.id !== shapeId);
    handleShapesChange(filteredShapes);
    
    if (selectedId === shapeId) {
      setSelectedId(null);
      setIsPropertiesModalVisible(false);
      onSelectShape?.(null);
    }
  }, [shapes, selectedId, handleShapesChange, onSelectShape]);
  
  // Handle equipment selection
  const handleEquipmentSelect = useCallback((equipment: Equipment) => {
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
  }, [shapes, handleShapesChange]);
  
  // Get the selected shape
  const getSelectedShape = useCallback(() => {
    if (!selectedId) return null;
    return shapes.find(shape => shape.id === selectedId) || null;
  }, [shapes, selectedId]);

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
      
      <div 
        ref={containerRef}
        className="h-full flex-1 border rounded-lg bg-white"
        style={{ width: '100%', position: 'relative' }}
      >
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
                      
                      // Double click to open properties modal (simulated with timeout)
                      if (selectedId === shape.id) {
                        setIsPropertiesModalVisible(true);
                      }
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
                    
                    // Double click to open properties modal (simulated with timeout)
                    if (selectedId === shape.id) {
                      setIsPropertiesModalVisible(true);
                    }
                  }}
                  onChange={updateShape}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
      
      {/* Modal for shape properties */}
      <ShapePropertiesModal
        visible={isPropertiesModalVisible}
        shape={getSelectedShape()}
        onUpdate={updateShape}
        onDelete={deleteShape}
        onCancel={() => setIsPropertiesModalVisible(false)}
      />
      
      {/* Modal for equipment selection */}
      <EquipmentSelectModal
        visible={isEquipmentModalVisible}
        onCancel={() => setIsEquipmentModalVisible(false)}
        onSelect={handleEquipmentSelect}
      />
    </div>
  );
};

export default SiteLayoutCanvas;