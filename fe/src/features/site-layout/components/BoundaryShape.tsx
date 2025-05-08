// src/features/site-layout/components/BoundaryShape.tsx
import React, { useRef } from 'react';
import { Group, Rect } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { Shape } from '../types';

interface BoundaryShapeProps {
  shape: Shape;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Shape) => void;
  onContextMenu?: (e: KonvaEventObject<PointerEvent>) => void;
}

const BoundaryShape: React.FC<BoundaryShapeProps> = ({
  shape,
  isSelected,
  onSelect,
  onChange,
  onContextMenu
}) => {
  const groupRef = useRef<any>(null);

  // Dash line style for boundary
  const dashPattern = [10, 5];
  
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    onChange({
      ...shape,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  return (
    <Group
      ref={groupRef}
      x={shape.x}
      y={shape.y}
      draggable
      onDragEnd={handleDragEnd}
      onClick={onSelect}
      onTap={onSelect}
      onContextMenu={onContextMenu}
    >
      {/* Boundary rectangle with dashed stroke */}
      <Rect
        width={shape.width}
        height={shape.height}
        fill="transparent"
        stroke="#000"
        strokeWidth={2}
        dash={dashPattern}
        strokeScaleEnabled={false}
        perfectDrawEnabled={false}
        strokeDashOffset={0}
        strokeHitEnabled={true}
        strokeEnabled={true}
        strokeDashArray={dashPattern}
        cornerRadius={0}
        opacity={isSelected ? 1 : 0.7}
      />
      
      {/* Label at top left */}
      {shape.name && (
        <Rect
          x={5}
          y={5}
          width={shape.name.length * 8 + 20}
          height={30}
          fill="rgba(255, 255, 255, 0.8)"
          cornerRadius={3}
          perfectDrawEnabled={false}
        />
      )}
      
      {/* Size indicators at bottom right */}
      <Rect
        x={shape.width - 100}
        y={shape.height - 30}
        width={95}
        height={25}
        fill="rgba(255, 255, 255, 0.8)"
        cornerRadius={3}
        perfectDrawEnabled={false}
      />
    </Group>
  );
};

export default BoundaryShape;