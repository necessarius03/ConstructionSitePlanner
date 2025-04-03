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

export type ShapeType = 'equipment' | 'material' | 'zone' | 'storage' | 'path';

export interface Shape extends BaseShape {
  type: ShapeType;
  name?: string;
  description?: string;
  rotation?: number;
  attributes?: Record<string, unknown>;
}

export interface CanvasGridProps extends Size {
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
}

export interface CanvasToolbarProps {
  onAddShape: (type: ShapeType) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export interface ShapePropertiesProps {
  shape: Shape | null;
  onUpdate: (shape: Shape) => void;
  onDelete: (shapeId: number) => void;
}

export type { KonvaRect, KonvaTransformer, KonvaStage };
