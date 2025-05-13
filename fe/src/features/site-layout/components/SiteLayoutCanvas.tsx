import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Rect, Transformer } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import type { Transformer as KonvaTransformer } from 'konva/lib/shapes/Transformer';
import type { Stage as KonvaStage } from 'konva/lib/Stage';
import { Button, Tooltip, Space } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, FullscreenOutlined, DragOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
  Shape,
  ShapeType,
  CanvasGridProps,
  DraggableRectProps,
  SiteLayoutCanvasProps
} from '../types';
import { CanvasToolbar } from './CanvasToolbar';
import CanvasControlsHelp from './CanvasControlsHelp';
import ShapePropertiesModal from './ShapePropertiesModal';
import EquipmentSelectModal from './EquipmentSelectModal';
import { Equipment } from '../../../data/equipment-data';
import EquipmentIconShape from './EquipmentIconShape';
import BoundaryModal from './BoundaryModal';
import BoundaryShape from './BoundaryShape';

const GRID_SIZE = 20;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 3;
const ZOOM_FACTOR = 1.1; // Zoom in/out by 10% per step

const CanvasGrid: React.FC<CanvasGridProps & { scale: number }> = ({ 
  width, 
  height, 
  gridSize = GRID_SIZE,
  color = '#ddd',
  opacity = 0.5,
  scale = 1
}) => {
  // Adjust grid size based on zoom level
  const effectiveGridSize = gridSize * scale;
  
  // Calculate how many grid lines we need
  const gridComponents = [];
  
  // We extend the grid slightly beyond the visible area
  const extendedWidth = width / scale + GRID_SIZE * 20;
  const extendedHeight = height / scale + GRID_SIZE * 20;
  
  // Only draw grid lines that will be visible (improves performance)
  for (let i = 0; i <= extendedWidth; i += gridSize) {
    gridComponents.push(
      <Rect
        key={`v${i}`}
        x={i}
        y={0}
        width={1 / scale} // Adjust line width based on scale
        height={extendedHeight}
        fill={color}
        opacity={opacity}
      />
    );
  }
  
  for (let i = 0; i <= extendedHeight; i += gridSize) {
    gridComponents.push(
      <Rect
        key={`h${i}`}
        x={0}
        y={i}
        width={extendedWidth}
        height={1 / scale} // Adjust line width based on scale
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
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight - 200);
  
  // New state for zoom and pan
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastCenter, setLastCenter] = useState<{ x: number, y: number } | null>(null);
  const [lastDist, setLastDist] = useState<number | null>(null);
  const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [isBoundaryModalVisible, setIsBoundaryModalVisible] = useState(false);
  
  const handleAddBoundary = () => {
    setIsBoundaryModalVisible(true);
  };

  const createBoundary = (width: number, height: number, name: string, isLocked: boolean) => {
    const newShape: Shape = {
      id: Date.now(),
      x: 50,
      y: 50,
      width,
      height,
      fill: 'transparent',
      opacity: 1,
      type: 'boundary',
      isSelected: false,
      name: name || 'Ranh giới công trường',
      rotation: 0,
      isLocked: isLocked
    };
    
    handleShapesChange([...shapes, newShape]);
    setIsBoundaryModalVisible(false);
  };

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
        // Sử dụng toàn bộ chiều rộng của cửa sổ
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

  // Track Shift key state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(true);
      }
      
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
      
      // Zoom controls with keyboard
      if (e.ctrlKey && e.key === '+') {
        e.preventDefault();
        handleZoomIn();
      }
      if (e.ctrlKey && e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      }
      if (e.ctrlKey && e.key === '0') {
        e.preventDefault();
        resetZoom();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedId]);

  useEffect(() => {
    // Kiểm tra xem đã hiển thị trợ giúp lần nào chưa
    const hasShownHelp = localStorage.getItem('hasShownCanvasHelp');
    
    if (!hasShownHelp) {
      // Hiển thị modal trợ giúp sau 2 giây để người dùng có thời gian nhìn canvas
      const timer = setTimeout(() => {
        setIsHelpModalVisible(true);
        localStorage.setItem('hasShownCanvasHelp', 'true');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
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
      shape.id === updatedShape.id ? {
        ...updatedShape,
        isLocked: updatedShape.isLocked // Đảm bảo giữ nguyên trạng thái khóa
      } : shape
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
      iconName: equipment.iconName,
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

  // Zoom handlers
  const handleZoomIn = () => {
    if (scale < MAX_ZOOM) {
      // Zoom in to the center of the stage
      const newScale = Math.min(scale * ZOOM_FACTOR, MAX_ZOOM);
      
      // Calculate the new position to zoom toward center
      const stage = stageRef.current;
      if (stage) {
        const oldScale = scale;
        const pointer = {
          x: stage.width() / 2,
          y: stage.height() / 2,
        };
        
        const mousePointTo = {
          x: (pointer.x - position.x) / oldScale,
          y: (pointer.y - position.y) / oldScale,
        };
        
        const newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        };
        
        setScale(newScale);
        setPosition(newPos);
      } else {
        setScale(newScale);
      }
    }
  };

  const handleZoomOut = () => {
    if (scale > MIN_ZOOM) {
      // Zoom out from the center of the stage
      const newScale = Math.max(scale / ZOOM_FACTOR, MIN_ZOOM);
      
      // Calculate the new position to zoom toward center
      const stage = stageRef.current;
      if (stage) {
        const oldScale = scale;
        const pointer = {
          x: stage.width() / 2,
          y: stage.height() / 2,
        };
        
        const mousePointTo = {
          x: (pointer.x - position.x) / oldScale,
          y: (pointer.y - position.y) / oldScale,
        };
        
        const newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        };
        
        setScale(newScale);
        setPosition(newPos);
      } else {
        setScale(newScale);
      }
    }
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    const stage = stageRef.current;
    if (!stage) return;
    
    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    
    if (!pointer) return;
    
    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };
    
    let newScale = scale;
    if (e.evt.deltaY < 0) {
      newScale = Math.min(oldScale * ZOOM_FACTOR, MAX_ZOOM);
    } else {
      newScale = Math.max(oldScale / ZOOM_FACTOR, MIN_ZOOM);
    }
    
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    
    setScale(newScale);
    setPosition(newPos);
  };

  // Pan handlers
  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    // Khi click vào một đối tượng cụ thể, không phải Stage, thì không cần Shift
    const clickedOnStage = e.target === e.target.getStage();
    
    // Nếu click vào stage và đang nhấn shift, cho phép kéo stage
    if (clickedOnStage && isShiftPressed) {
      setIsDragging(true);
    } 
    // Nếu click vào stage mà không nhấn shift, ngăn kéo
    else if (clickedOnStage && !isShiftPressed) {
      e.currentTarget.stopDrag();
    }
    // Nếu click vào đối tượng, không cần làm gì, cho phép kéo bình thường
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    // Chỉ xử lý cho Stage, không ảnh hưởng đến kéo đối tượng
    const clickedOnStage = e.target === e.target.getStage();
    
    if (clickedOnStage) {
      if (!isDragging || !isShiftPressed) {
        // Nếu không còn nhấn shift, dừng việc kéo stage
        if (!isShiftPressed) {
          e.currentTarget.stopDrag();
          return;
        }
        return;
      }
      
      const stage = stageRef.current;
      if (stage) {
        const maxX = canvasWidth * scale * 0.5;  // Cho phép kéo tối đa một nửa kích thước stage
        const maxY = canvasHeight * scale * 0.5;
        
        const newX = Math.min(Math.max(e.target.x(), -maxX), maxX);
        const newY = Math.min(Math.max(e.target.y(), -maxY), maxY);
        
        setPosition({
          x: newX,
          y: newY,
        });
      }
    }
  };

  // For mobile touch support
  const handleTouch = (e: KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault();
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];
    
    const stage = stageRef.current;
    if (!stage) return;
    
    // If we have multiple touches, it's pinch-to-zoom
    if (touch1 && touch2) {
      const p1 = {
        x: touch1.clientX,
        y: touch1.clientY,
      };
      const p2 = {
        x: touch2.clientX,
        y: touch2.clientY,
      };
      
      if (!lastCenter) {
        setLastCenter({
          x: (p1.x + p2.x) / 2,
          y: (p1.y + p2.y) / 2,
        });
        return;
      }
      
      const newCenter = {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
      };
      
      const dist = Math.sqrt(
        Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
      );
      
      if (!lastDist) {
        setLastDist(dist);
        return;
      }
      
      // Calculate new scale
      const pointTo = {
        x: (newCenter.x - position.x) / scale,
        y: (newCenter.y - position.y) / scale,
      };
      
      const oldScale = scale;
      let newScale = scale;
      
      // Adjust scale based on pinch distance
      if (dist > lastDist) {
        newScale = Math.min(oldScale * ZOOM_FACTOR, MAX_ZOOM);
      } else {
        newScale = Math.max(oldScale / ZOOM_FACTOR, MIN_ZOOM);
      }
      
      // Calculate new position
      const newPos = {
        x: newCenter.x - pointTo.x * newScale,
        y: newCenter.y - pointTo.y * newScale,
      };
      
      // Update state
      setScale(newScale);
      setPosition(newPos);
      setLastDist(dist);
      setLastCenter(newCenter);
    }
  };

  const handleTouchEnd = () => {
    setLastCenter(null);
    setLastDist(null);
  };

  const zoomPercentage = Math.round(scale * 100);

  return (
    <div className="h-full" style={{ display: 'flex', flexDirection: 'column' }}>
      <CanvasToolbar 
        onAddShape={addShape}
        onShowEquipmentModal={() => setIsEquipmentModalVisible(true)}
        onAddBoundary={handleAddBoundary}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyStep > 0}
        canRedo={historyStep < history.length - 1}
      />
      
      <div 
        ref={containerRef}
        className="h-full flex-1 border rounded-lg bg-white relative overflow-hidden"
        style={{ 
          width: '100%', 
          position: 'relative',
        }}
      >
        {/* Help Button ở góc trên bên trái */}
        <div className="absolute top-4 left-4 z-10">
          <Tooltip title="Hướng dẫn điều khiển">
            <Button
              icon={<QuestionCircleOutlined />}
              size="small"
              onClick={() => setIsHelpModalVisible(true)}
              className="shadow-md"
            />
          </Tooltip>
        </div>
        
        {/* Status Info ở phía dưới bên trái */}
        <div className="absolute bottom-4 left-4 z-10 bg-white bg-opacity-80 px-2 py-1 rounded text-xs text-gray-700">
          {isDragging ? 
            'Đang di chuyển mặt bằng...' : 
            (isShiftPressed ? 
              'Nhấn giữ chuột để di chuyển mặt bằng' : 
              'Nhấn Shift + chuột để di chuyển mặt bằng')}
        </div>
        
        {/* Zoom Controls ở phía dưới bên phải */}
        <div className="absolute bottom-4 right-4 z-10">
          <div className="bg-white shadow-md rounded-md px-2 py-1 flex items-center space-x-1">
            <Button 
              icon={<ZoomOutOutlined />} 
              size="small" 
              onClick={handleZoomOut}
              disabled={scale <= MIN_ZOOM}
            />
            <span className="mx-1 text-xs" style={{ width: '36px', textAlign: 'center' }}>
              {zoomPercentage}%
            </span>
            <Button 
              icon={<ZoomInOutlined />} 
              size="small" 
              onClick={handleZoomIn}
              disabled={scale >= MAX_ZOOM}
            />
            <Button 
              icon={<FullscreenOutlined />} 
              size="small" 
              onClick={resetZoom}
            />
          </div>
        </div>
        
        <Stage
          ref={stageRef}
          width={canvasWidth}
          height={canvasHeight}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          draggable={isShiftPressed} // Chỉ cho phép drag khi shift được nhấn
          onClick={checkDeselect}
          onTap={checkDeselect as unknown as (e: KonvaEventObject<TouchEvent>) => void}
          onWheel={handleWheel}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragMove={handleDragMove}
          onTouchMove={handleTouch}
          onTouchEnd={handleTouchEnd}
        >
          <Layer>
            <CanvasGrid 
              width={canvasWidth} 
              height={canvasHeight}
              gridSize={gridSize}
              scale={scale}
            />
            {shapes.map((shape) => {
              // Sử dụng loại shape để quyết định component hiển thị
              if (shape.type === 'equipment') {
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
                    onContextMenu={(e) => {
                      e.evt.preventDefault();
                      setSelectedId(shape.id);
                      onSelectShape?.(shape);
                      setIsPropertiesModalVisible(true);
                    }}
                  />
                );
              }

              if (shape.type === 'boundary') {
                return (
                  <BoundaryShape
                    key={shape.id}
                    shape={shape}
                    isSelected={shape.id === selectedId}
                    onSelect={() => {
                      setSelectedId(shape.id);
                      onSelectShape?.(shape);
                    }}
                    onChange={updateShape}
                    onContextMenu={(e) => {
                      e.evt.preventDefault();
                      setSelectedId(shape.id);
                      onSelectShape?.(shape);
                      setIsPropertiesModalVisible(true);
                    }}
                  />
                );
              }
              
              // Các loại shape khác
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
                  onContextMenu={(e) => {
                    e.evt.preventDefault();
                    setSelectedId(shape.id);
                    onSelectShape?.(shape);
                    setIsPropertiesModalVisible(true);
                  }}
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
      
      {/* Help Modal */}
      <CanvasControlsHelp
        visible={isHelpModalVisible}
        onClose={() => setIsHelpModalVisible(false)}
      />

      <BoundaryModal
        visible={isBoundaryModalVisible}
        onCancel={() => setIsBoundaryModalVisible(false)}
        onConfirm={createBoundary}
      />
    </div>
  );
}

export default SiteLayoutCanvas;