// src/features/site-layout/types.ts
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import type { Transformer as KonvaTransformer } from 'konva/lib/shapes/Transformer';
import type { Stage as KonvaStage } from 'konva/lib/Stage';

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface BaseShape extends Point, Size {
  id: number;
  fill: string;
  opacity: number;
  isSelected: boolean;
}

export type ShapeType = 'equipment' | 'material' | 'zone' | 'storage' | 'path' | 'boundary';

export interface Shape extends BaseShape {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  opacity: number;
  type: ShapeType;
  iconName?: string; // Tên icon cho thiết bị
  isSelected: boolean;
  name?: string;
  rotation?: number;
  equipmentId?: string; 
  iconComponent?: React.ComponentType;
  notes?: string;  // Thêm field notes
  isLocked?: boolean; // Thêm field isLocked
}

export interface CanvasGridProps extends Size {
  width: number;
  height: number;
  gridSize?: number;
  color?: string;
  opacity?: number;
}

export interface DraggableRectProps {
  shapeProps: Shape;
  isLocked?: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Shape) => void;
  onContextMenu?: (e: KonvaEventObject<PointerEvent>) => void;
}

export interface SiteLayoutCanvasProps {
  initialShapes?: Shape[];
  isReadOnly?: boolean;
  gridSize?: number;
  onShapesChange?: (shapes: Shape[]) => void;
  onSelectShape?: (shape: Shape | null) => void;
  defaultScale?: number; // Thêm thuộc tính mới
  minScale?: number;     // Thêm thuộc tính mới
  maxScale?: number;     // Thêm thuộc tính mới
}

export interface CanvasToolbarProps {
  onAddShape: (type: ShapeType) => void;
  onShowEquipmentModal?: () => void;
  onAddBoundary?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export interface ShapePropertiesProps {
  shape: Shape | null;
  onUpdate: (shape: Shape) => void;
  onDelete: (shapeId: number) => void;
  onClose?: () => void;
}

export interface ShapePropertiesModalProps {
  visible: boolean;
  shape: Shape | null;
  onUpdate: (shape: Shape) => void;
  onDelete: (shapeId: number) => void;
  onCancel: () => void;
}

export type { KonvaRect, KonvaTransformer, KonvaStage };