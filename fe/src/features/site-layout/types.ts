// fe/src/features/site-layout/types.ts - Updated with 3D support
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import type { Transformer as KonvaTransformer } from 'konva/lib/shapes/Transformer';
import type { Stage as KonvaStage } from 'konva/lib/Stage';
import * as THREE from 'three';

export interface Point {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Size3D extends Size {
  depth: number;
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
  isSelected: boolean;
  name?: string;
  rotation?: number;
  equipmentId?: string; 
  iconName?: string;
  notes?: string;
  isLocked?: boolean;
  // 3D specific properties
  position3D?: Point3D;
  scale3D?: Point3D;
  model3D?: string; // Path to 3D model file
  animation?: Animation3D;
  workingRadius?: number; // For equipment working area
  safetyZone?: number; // Safety zone radius
}

export interface Animation3D {
  type: 'rotation' | 'movement' | 'scale' | 'none';
  speed: number;
  direction?: THREE.Vector3;
  loop: boolean;
  enabled: boolean;
}

export interface Camera3DSettings {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  near: number;
  far: number;
}

export interface Lighting3DSettings {
  ambient: {
    intensity: number;
    color: string;
  };
  directional: {
    intensity: number;
    color: string;
    position: [number, number, number];
    castShadow: boolean;
  };
  sky: {
    enabled: boolean;
    turbidity: number;
    rayleigh: number;
    mieCoefficient: number;
    mieDirectionalG: number;
    sunPosition: [number, number, number];
  };
}

export interface Scene3DSettings {
  camera: Camera3DSettings;
  lighting: Lighting3DSettings;
  environment: {
    background: 'sky' | 'color' | 'hdri';
    backgroundValue: string;
    fog: {
      enabled: boolean;
      color: string;
      near: number;
      far: number;
    };
  };
  grid: {
    enabled: boolean;
    size: number;
    divisions: number;
    color: string;
  };
  performance: {
    renderQuality: 'low' | 'medium' | 'high';
    shadows: boolean;
    antialiasing: boolean;
    pixelRatio: number;
  };
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
  defaultScale?: number;
  minScale?: number;
  maxScale?: number;
}

// 3D specific interfaces
export interface SiteLayout3DCanvasProps extends SiteLayoutCanvasProps {
  progress?: any[]; // Progress data for visualization
  viewMode?: '2d' | '3d';
  sceneSettings?: Scene3DSettings;
  onSceneSettingsChange?: (settings: Scene3DSettings) => void;
}

export interface Equipment3DProps {
  shape: Shape;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (shape: Shape) => void;
  viewMode: 'overview' | 'equipment' | 'progress' | 'safety';
  animationEnabled?: boolean;
}

export interface Boundary3DProps {
  shape: Shape;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (shape: Shape) => void;
  progress: any[];
  viewMode: 'overview' | 'equipment' | 'progress' | 'safety';
}

export interface TransportFlow3DProps {
  shapes: Shape[];
  progress: any[];
  animationSpeed?: number;
  showFlowParticles?: boolean;
}

export interface ProgressZone3DProps {
  shape: Shape;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (shape: Shape) => void;
  progress?: any;
  viewMode: 'overview' | 'equipment' | 'progress' | 'safety';
}

export interface CanvasToolbarProps {
  onAddShape: (type: ShapeType) => void;
  onShowEquipmentModal?: () => void;
  onAddBoundary?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  viewMode?: '2d' | '3d';
  onViewModeChange?: (mode: '2d' | '3d') => void;
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
  onLinkProgress?: (shapeId: string) => void;
  linkedProgress?: any[];
}

// 3D Model interfaces
export interface Model3DAsset {
  id: string;
  name: string;
  type: 'equipment' | 'building' | 'vehicle' | 'generic';
  path: string;
  thumbnail?: string;
  dimensions: Size3D;
  animations?: string[];
}

export interface Model3DLibrary {
  [key: string]: Model3DAsset;
}

// Export performance monitoring
export interface Performance3DStats {
  fps: number;
  memory: {
    used: number;
    total: number;
  };
  render: {
    calls: number;
    triangles: number;
    points: number;
    lines: number;
  };
  geometries: number;
  textures: number;
}

// VR/AR interfaces
export interface VRControllerState {
  connected: boolean;
  position: THREE.Vector3;
  rotation: THREE.Quaternion;
  buttons: boolean[];
  axes: number[];
}

export interface ARMarker {
  id: string;
  position: Point3D;
  rotation: Point3D;
  scale: number;
  shape: Shape;
}

export type { KonvaRect, KonvaTransformer, KonvaStage };