// src/features/site-layout/components/BoundaryShape.tsx
import React, { useRef } from 'react';
import { Group, Rect, Text } from 'react-konva';
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

  const dashPattern = [10, 5];
  
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    onChange({
      ...shape,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleToggleLock = () => {
    onChange({
      ...shape,
      isLocked: !shape.isLocked,
    });
  };

  const formatDimension = (size: number) => {
    return `${size}px`;
  };

  return (
    <Group
      ref={groupRef}
      x={shape.x}
      y={shape.y}
      draggable={!shape.isLocked}
      onDragEnd={handleDragEnd}
      onClick={onSelect}
      onTap={onSelect}
      onContextMenu={onContextMenu}
    >
      <Rect
        width={shape.width}
        height={shape.height}
        fill="transparent"
        stroke={isSelected ? "#1677ff" : "#000"}
        strokeWidth={isSelected ? 2 : 1.5}
        dash={dashPattern}
        hitStrokeWidth={4}
        perfectDrawEnabled={false}
        cornerRadius={0}
        opacity={isSelected ? 1 : 0.8}
      />
      
      <Rect
        x={10}
        y={10}
        width={Math.min((shape.name?.length || 0) * 8 + 40, 300)}
        height={30}
        fill="rgba(255, 255, 255, 0.85)"
        cornerRadius={3}
        shadowColor="rgba(0,0,0,0.2)"
        shadowBlur={2}
        shadowOffsetX={1}
        shadowOffsetY={1}
        perfectDrawEnabled={false}
      />
      
      <Text
        x={15}
        y={18}
        text={shape.name || 'Ranh giới'}
        fontSize={14}
        fontFamily="Arial"
        fill="#000"
        width={290}
        ellipsis={true}
      />
      
      <Rect
        x={shape.width / 2 - 50}
        y={shape.height - 30}
        width={100}
        height={24}
        fill="rgba(255, 255, 255, 0.85)"
        cornerRadius={3}
        shadowColor="rgba(0,0,0,0.2)"
        shadowBlur={2}
        shadowOffsetX={1}
        shadowOffsetY={1}
        perfectDrawEnabled={false}
      />
      
      <Text
        x={shape.width / 2 - 45}
        y={shape.height - 25}
        text={`Rộng: ${formatDimension(shape.width)}`}
        fontSize={12}
        fontFamily="Arial"
        fill="#333"
        align="center"
      />
      
      <Rect
        x={shape.width - 90}
        y={shape.height / 2 - 12}
        width={80}
        height={24}
        fill="rgba(255, 255, 255, 0.85)"
        cornerRadius={3}
        shadowColor="rgba(0,0,0,0.2)"
        shadowBlur={2}
        shadowOffsetX={1}
        shadowOffsetY={1}
        perfectDrawEnabled={false}
      />
      
      <Text
        x={shape.width - 85}
        y={shape.height / 2 - 7}
        text={`Dài: ${formatDimension(shape.height)}`}
        fontSize={12}
        fontFamily="Arial"
        fill="#333"
        align="center"
      />
      
      <Group 
        x={shape.width - 30}
        y={10}
        onClick={handleToggleLock}
      >
        <Rect
          width={24}
          height={24}
          fill="#ffffff"
          cornerRadius={12}
          shadowColor="rgba(0,0,0,0.2)"
          shadowBlur={2}
          shadowOffsetX={1}
          shadowOffsetY={1}
        />
        <Text
          x={0}
          y={0}
          width={24}
          height={24}
          text={shape.isLocked ? "🔒" : "🔓"}
          fontSize={14}
          align="center"
          verticalAlign="middle"
        />
      </Group>
    </Group>
  );
};

export default BoundaryShape;